import { describe, expect, it } from "vitest";
import { fetchPublished, mapBlocks, mapBlog, mapProject, safeHref } from "./cms.mjs";

describe("safeHref", () => {
    it("keeps web, mail, phone and site links and drops everything else", () => {
        expect(safeHref("https://example.com/a")).toBe("https://example.com/a");
        expect(safeHref("mailto:hi@example.com")).toBe("mailto:hi@example.com");
        expect(safeHref("/contact")).toBe("/contact");
        expect(safeHref("javascript:alert(1)")).toBeUndefined();
        expect(safeHref("data:text/html,x")).toBeUndefined();
        expect(safeHref(undefined)).toBeUndefined();
    });
});

describe("mapBlocks", () => {
    it("keeps plain text beside formatted runs and drops unsafe links", () => {
        const [paragraph] = mapBlocks([
            {
                type: "paragraph",
                content: [
                    { text: "See " },
                    { text: "this", bold: true, href: "https://example.com" },
                    { text: " and ", href: "javascript:alert(1)" },
                ],
            },
        ]);
        expect(paragraph.text).toBe("See this and ");
        expect(paragraph.inline).toEqual([
            { text: "See " },
            { text: "this", bold: true, href: "https://example.com" },
            { text: " and " },
        ]);
    });

    it("maps headings, lists and images and skips empty or unknown blocks", () => {
        const blocks = mapBlocks([
            { type: "heading", level: 3, text: "Sub" },
            {
                type: "list",
                ordered: true,
                items: [[{ text: "One" }], [{ text: "Two", italic: true }]],
            },
            {
                type: "image",
                url: "https://cdn/x.png",
                alt: "Chart",
                caption: "Fig",
                width: 800,
                height: 400,
            },
            { type: "image", alt: "no url" },
            { type: "paragraph", content: [] },
            { type: "video" },
        ]);
        expect(blocks).toEqual([
            { type: "heading", level: 3, text: "Sub" },
            {
                type: "list",
                ordered: true,
                items: ["One", "Two"],
                itemsInline: [[{ text: "One" }], [{ text: "Two", italic: true }]],
            },
            {
                type: "image",
                src: "https://cdn/x.png",
                alt: "Chart",
                caption: "Fig",
                width: 800,
                height: 400,
            },
        ]);
    });
});

describe("mapBlog", () => {
    const detail = {
        slug: "hello",
        title: "Hello",
        excerpt: "Intro",
        category: "Process",
        author: "Ada",
        readingTimeMinutes: 0,
        publishedAt: "2026-03-12T09:30:00.000Z",
        updatedAt: "2026-03-13T09:30:00.000Z",
        featuredImage: { url: "https://cdn/cover.png", alt: "Cover" },
        images: [{ url: "https://cdn/g.png", alt: "G", width: 640, height: 480 }],
        content: [{ type: "paragraph", content: [{ text: "Body" }] }],
        seo: { title: "", description: "" },
    };

    it("produces the website's BlogPost shape", () => {
        expect(mapBlog(detail)).toMatchObject({
            slug: "hello",
            status: "published",
            publishedAt: "2026-03-12",
            readingTime: "1 min read",
            author: { name: "Ada" },
            category: "Process",
            categories: ["Process"],
            coverImage: "https://cdn/cover.png",
            gallery: [{ src: "https://cdn/g.png", alt: "G", width: 640, height: 480 }],
            seo: { title: "Hello", description: "Intro" },
        });
    });

    it("copes with a post that has no image, author or category", () => {
        const post = mapBlog({
            ...detail,
            featuredImage: null,
            images: [],
            author: "",
            category: "",
        });
        expect(post.coverImage).toBe("");
        expect(post.gallery).toEqual([]);
        expect(post.author.name).toBe("Classific");
        expect(post.category).toBe("General");
    });
});

describe("mapProject", () => {
    it("maps the CMS case-study fields onto the site's project fields", () => {
        const project = mapProject({
            slug: "fleet",
            title: "Fleet",
            clientName: "Northwind",
            summary: "Short",
            overview: "Overview",
            challenges: "Problems",
            solutions: "Fixes",
            results: "Faster",
            technologies: ["React"],
            category: "Logistics",
            projectUrl: "https://example.com",
            featuredImage: { url: "https://cdn/f.png", alt: "", width: 1200, height: 800 },
            images: [{ url: "https://cdn/g.png", alt: "G" }],
            publishedAt: "2026-04-01T00:00:00.000Z",
            seo: { title: "", description: "" },
        });
        expect(project).toMatchObject({
            slug: "fleet",
            clientName: "Northwind",
            description: "Overview",
            challenge: "Problems",
            approach: "",
            solution: "Fixes",
            results: "Faster",
            category: "Logistics",
            services: [],
            projectUrl: "https://example.com",
            publishedAt: "2026-04-01",
            image: { src: "https://cdn/f.png", alt: "Fleet", width: 1200, height: 800 },
        });
        expect(project.gallery).toEqual([
            { src: "https://cdn/g.png", alt: "G", width: 1600, height: 1000 },
        ]);
    });

    it("drops a non-web project link", () => {
        const project = mapProject({
            slug: "x",
            title: "X",
            summary: "s",
            overview: "o",
            projectUrl: "javascript:1",
        });
        expect(project.projectUrl).toBeUndefined();
    });
});

describe("fetchPublished", () => {
    const respond = (body, ok = true) => ({ ok, status: ok ? 200 : 500, json: async () => body });

    it("walks every page of a listing, then reads each item's detail", async () => {
        const urls = [];
        const fetchImpl = async (url) => {
            urls.push(url);
            if (url.includes("page=1"))
                return respond({ success: true, data: [{ slug: "a" }], meta: { totalPages: 2 } });
            if (url.includes("page=2"))
                return respond({ success: true, data: [{ slug: "b" }], meta: { totalPages: 2 } });
            return respond({ success: true, data: { slug: url.split("/").pop() } });
        };
        const details = await fetchPublished("https://api.example.com/", "blogs", {
            fetchImpl,
            retries: 1,
        });
        expect(details.map((item) => item.slug)).toEqual(["a", "b"]);
        expect(urls[0]).toBe(
            "https://api.example.com/api/blogs?limit=50&page=1&sortBy=publishedAt&order=desc",
        );
    });

    it("retries a failing request and then gives up with a clear error", async () => {
        let calls = 0;
        const fetchImpl = async () => {
            calls += 1;
            return respond({}, false);
        };
        await expect(
            fetchPublished("https://api.example.com", "blogs", { fetchImpl, retries: 2 }),
        ).rejects.toThrow(/Could not read .*HTTP 500/);
        expect(calls).toBe(2);
    });
});
