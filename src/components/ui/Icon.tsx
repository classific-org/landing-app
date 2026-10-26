import type { IconName } from "@/types/content";

type IconProps = {
    name: IconName;
    className?: string;
    /** Provide a label when the icon conveys meaning on its own. */
    label?: string;
};

/** Outline paths copied from the Classific design kit (docs/assets/icons). */
const paths: Record<IconName, React.ReactNode> = {
    monitor: (
        <>
            <rect x="3" y="4" width="18" height="13" rx="1" />
            <path d="M8 21h8M12 17v4" />
        </>
    ),
    smartphone: (
        <>
            <rect x="7" y="2" width="10" height="20" rx="1.5" />
            <path d="M11 18h2" />
        </>
    ),
    "app-window": (
        <>
            <rect x="3" y="4" width="18" height="16" rx="1" />
            <path d="M3 8h18M7 6h.01M10 6h.01" />
        </>
    ),
    layers: (
        <>
            <path d="m12 3 9 5-9 5-9-5 9-5Z" />
            <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
        </>
    ),
    code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
    workflow: (
        <>
            <rect x="3" y="3" width="6" height="6" rx="1" />
            <rect x="15" y="15" width="6" height="6" rx="1" />
            <path d="M9 6h4a2 2 0 0 1 2 2v7M12 15l3 3 3-3" />
        </>
    ),
    "shield-check": (
        <>
            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
            <path d="m9 12 2 2 4-4" />
        </>
    ),
    "arrow-right": <path d="M4 12h15M13 5l7 7-7 7" />,
};

export function Icon({ name, className, label }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            focusable="false"
        >
            {paths[name]}
        </svg>
    );
}
