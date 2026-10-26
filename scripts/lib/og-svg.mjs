function escapeXml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

export function buildOgSvg({ title, eyebrow = "Classific" }) {
    const safeTitle = escapeXml(title);
    const safeEyebrow = escapeXml(eyebrow);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#F7F7F4"/>
    <g fill="none" stroke="#E5E5E2" stroke-width="1">
        <path d="M720 0H1200V630H480Z"/>
        <path d="M880 0H1200V630H640Z"/>
        <path d="M1040 0H1200V630H820Z"/>
    </g>
    <g fill="none" stroke="#85898D" stroke-width="1" opacity="0.45">
        <path d="M620 420C760 380 840 500 980 430S1140 380 1260 420"/>
        <path d="M620 450C760 410 840 530 980 460S1140 410 1260 450"/>
        <path d="M620 480C760 440 840 560 980 490S1140 440 1260 480"/>
        <path d="M620 510C760 470 840 590 980 520S1140 470 1260 510"/>
    </g>
    <g transform="translate(80 72)">
        <path d="M0 22 36 2 72 24v42L36 88 0 66Z" fill="#111315"/>
        <path d="M16 32 36 22 56 32 36 42Z" fill="#FFFFFF"/>
        <path d="M16 54 36 44 56 54 36 64Z" fill="#FFFFFF"/>
        <path d="M36 22 56 32v22L36 44Z" fill="#245BDB"/>
        <text x="92" y="58" fill="#111315" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="600" letter-spacing="-1.2">Classific</text>
    </g>
    <text x="80" y="250" fill="#85898D" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" letter-spacing="3.2">${safeEyebrow}</text>
    <text x="80" y="340" fill="#111315" font-family="Inter, Arial, sans-serif" font-size="64" font-weight="500" letter-spacing="-1.6">${safeTitle}</text>
    <rect x="80" y="546" width="56" height="4" fill="#245BDB"/>
    <text x="152" y="552" fill="#62666B" font-family="Inter, Arial, sans-serif" font-size="22">Software for what's next.</text>
</svg>`;
}
