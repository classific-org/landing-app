/**
 * Reads published blogs and projects from the Classific API and turns them into the shapes the
 * website already renders (BlogPost and Project in src/types and src/data). Runs at build time,
 * so the result is prerendered into plain HTML with the rest of the site.
 */

const FALLBACK_IMAGE = { width: 1600, height: 1000 };

/** Links a visitor may follow: web pages, mail, phone and site paths. Anything else is dropped. */
export function safeHref(value) {
    return typeof value === "string" && /^(https?:\/\/|mailto:|tel:|\/|#)\S*$/i.test(value.trim())
        ? value.trim()
        : undefined;
}

const toDate = (iso) =>
    typeof iso === "string" && iso.length >= 10 ? iso.slice(0, 10) : undefined;

function toImageAsset(image, fallbackAlt = "") {
    if (!image?.url) {
        return undefined;
    }
    return {
        src: image.url,
        alt: image.alt || fallbackAlt,
        width: image.width || FALLBACK_IMAGE.width,
        height: image.height || FALLBACK_IMAGE.height,
    };
}

function toRuns(runs = []) {
    return runs
        .filter((run) => typeof run?.text === "string" && run.text.length > 0)
        .map((run) => {
            const out = { text: run.text };
            if (run.bold) out.bold = true;
            if (run.italic) out.italic = true;
            const href = safeHref(run.href);
            if (href) out.href = href;
            return out;
        });
}

const plain = (runs) => runs.map((run) => run.text).join("");

/** API content blocks -> the site's article blocks (plain text kept beside the formatted runs). */
export function mapBlocks(blocks = []) {
    const out = [];
    for (const block of blocks) {
        if (block.type === "heading") {
            out.push({ type: "heading", level: block.level === 3 ? 3 : 2, text: block.text });
        } else if (block.type === "paragraph") {
            const inline = toRuns(block.content);
            if (inline.length) {
                out.push({ type: "paragraph", text: plain(inline), inline });
            }
        } else if (block.type === "list") {
            const itemsInline = (block.items ?? []).map(toRuns).filter((item) => item.length);
            if (itemsInline.length) {
                out.push({
                    type: "list",
                    ordered: Boolean(block.ordered),
                    items: itemsInline.map(plain),
                    itemsInline,
                });
            }
        } else if (block.type === "image" && block.url) {
            out.push({
                type: "image",
                src: block.url,
                alt: block.alt ?? "",
                caption: block.caption ?? "",
                width: block.width || FALLBACK_IMAGE.width,
                height: block.height || FALLBACK_IMAGE.height,
            });
        }
    }
    return out;
}

export function mapBlog(detail) {
    const minutes = Math.max(1, detail.readingTimeMinutes || 1);
    return {
        slug: detail.slug,
        title: detail.title,
        excerpt: detail.excerpt,
        status: "published",
        publishedAt: toDate(detail.publishedAt) ?? toDate(detail.updatedAt),
        updatedAt: toDate(detail.updatedAt),
        readingTime: `${minutes} min read`,
        author: { name: detail.author || "Classific" },
        category: detail.category || "General",
        categories: [detail.category || "General"],
        coverImage: detail.featuredImage?.url ?? "",
        gallery: (detail.images ?? []).map((image) => toImageAsset(image)).filter(Boolean),
        body: mapBlocks(detail.content),
        seo: {
            title: detail.seo?.title || detail.title,
            description: detail.seo?.description || detail.excerpt,
        },
    };
}

export function mapProject(detail) {
    const project = {
        slug: detail.slug,
        title: detail.title,
        category: detail.category || "Project",
        status: "published",
        clientName: detail.clientName || undefined,
        summary: detail.summary,
        description: detail.overview,
        challenge: detail.challenges,
        // The CMS has no separate "approach" section; the page hides it when empty.
        approach: "",
        solution: detail.solutions,
        results: detail.results || undefined,
        technologies: detail.technologies ?? [],
        services: [],
        publishedAt: toDate(detail.publishedAt) ?? toDate(detail.updatedAt),
        seo: {
            title: detail.seo?.title || detail.title,
            description: detail.seo?.description || detail.summary,
        },
    };
    const image = toImageAsset(detail.featuredImage, detail.title);
    if (image) project.image = image;
    const gallery = (detail.images ?? [])
        .map((item) => toImageAsset(item, detail.title))
        .filter(Boolean);
    if (gallery.length) project.gallery = gallery;
    if (detail.projectUrl && /^https?:\/\//i.test(detail.projectUrl)) {
        project.projectUrl = detail.projectUrl;
    }
    return project;
}

async function getJson(url, { retries = 3, timeoutMs = 15000, fetchImpl = fetch } = {}) {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            const response = await fetchImpl(url, {
                headers: { Accept: "application/json" },
                signal: AbortSignal.timeout(timeoutMs),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const body = await response.json();
            if (!body?.success) {
                throw new Error("unexpected response shape");
            }
            return body;
        } catch (error) {
            lastError = error;
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
            }
        }
    }
    throw new Error(`Could not read ${url}: ${lastError?.message ?? lastError}`);
}

/** Every published item of one resource ("blogs" or "projects"), full detail included. */
export async function fetchPublished(baseUrl, resource, options = {}) {
    const root = baseUrl.replace(/\/+$/, "");
    const slugs = [];
    for (let page = 1; ; page += 1) {
        const body = await getJson(
            `${root}/api/${resource}?limit=50&page=${page}&sortBy=publishedAt&order=desc`,
            options,
        );
        slugs.push(...body.data.map((item) => item.slug));
        if (page >= (body.meta?.totalPages ?? 1)) {
            break;
        }
    }
    const details = [];
    for (let index = 0; index < slugs.length; index += 5) {
        const batch = slugs.slice(index, index + 5);
        const results = await Promise.all(
            batch.map((slug) =>
                getJson(`${root}/api/${resource}/${encodeURIComponent(slug)}`, options),
            ),
        );
        details.push(...results.map((body) => body.data));
    }
    return details;
}

/** Everything the website needs from the CMS, already in the website's own shapes. */
export async function pullCmsContent(baseUrl, options = {}) {
    const [blogs, projects] = await Promise.all([
        fetchPublished(baseUrl, "blogs", options),
        fetchPublished(baseUrl, "projects", options),
    ]);
    return {
        fetchedAt: new Date().toISOString(),
        blogs: blogs.map(mapBlog),
        projects: projects.map(mapProject),
    };
}
