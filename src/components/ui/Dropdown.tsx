import { useCallback, useEffect, useId, useRef, useState } from "react";

export type DropdownOption = { value: string; label: string };

type DropdownProps = {
    /** Id of the trigger, so a <label htmlFor> reaches it. */
    id: string;
    name: string;
    value: string;
    options: ReadonlyArray<DropdownOption>;
    onValueChange: (value: string) => void;
    onBlur?: () => void;
    /** Shown while `value` matches no option. */
    placeholder?: string;
    invalid?: boolean;
    required?: boolean;
    "aria-describedby"?: string;
    className?: string;
};

/** How long a run of typed letters keeps narrowing the type-ahead match. */
const TYPEAHEAD_MS = 650;
/** Height the list needs below the trigger before it opens upward instead. */
const LIST_SPACE = 300;

function Chevron() {
    return (
        <svg
            className="dropdown-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function Check() {
    return (
        <svg
            className="h-4 w-4 flex-none text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
    );
}

/**
 * A select that matches the site instead of the operating system. It follows the ARIA
 * select-only combobox pattern: the trigger keeps focus, the list is a listbox, and arrows,
 * Home/End, Enter/Space, Escape and type-ahead all work. A hidden input carries the value so
 * the field submits like a native one.
 */
export function Dropdown({
    id,
    name,
    value,
    options,
    onValueChange,
    onBlur,
    placeholder = "Select an option",
    invalid = false,
    required = false,
    "aria-describedby": describedBy,
    className,
}: DropdownProps) {
    const listId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const typed = useRef({ text: "", timer: 0 });
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

    const selectedIndex = options.findIndex((option) => option.value === value);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
    const optionId = (index: number) => `${listId}-option-${index}`;

    const openList = useCallback(() => {
        const trigger = triggerRef.current;
        if (trigger) {
            const rect = trigger.getBoundingClientRect();
            const below = window.innerHeight - rect.bottom;
            setPlacement(below < LIST_SPACE && rect.top > below ? "top" : "bottom");
        }
        setActive(selectedIndex >= 0 ? selectedIndex : 0);
        setOpen(true);
    }, [selectedIndex]);

    const close = useCallback((returnFocus: boolean) => {
        setOpen(false);
        if (returnFocus) {
            triggerRef.current?.focus();
        }
    }, []);

    const commit = (index: number) => {
        const option = options[index];
        if (option) {
            onValueChange(option.value);
        }
        close(true);
    };

    // Close when the pointer goes down anywhere outside the control.
    useEffect(() => {
        if (!open) {
            return;
        }
        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    // Keep the highlighted option in view inside the list.
    useEffect(() => {
        if (!open) {
            return;
        }
        const item = listRef.current?.children[active] as HTMLElement | undefined;
        const list = listRef.current;
        if (!item || !list) {
            return;
        }
        if (item.offsetTop < list.scrollTop) {
            list.scrollTop = item.offsetTop;
        } else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
            list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
        }
    }, [open, active]);

    useEffect(() => () => window.clearTimeout(typed.current.timer), []);

    const typeAhead = (character: string) => {
        window.clearTimeout(typed.current.timer);
        typed.current.text += character.toLowerCase();
        typed.current.timer = window.setTimeout(() => (typed.current.text = ""), TYPEAHEAD_MS);
        const from = open ? active : Math.max(selectedIndex, 0);
        const ordered = [...options.keys()].map((_, offset) => (from + offset) % options.length);
        // A repeated single letter cycles through matches; a longer run narrows the match.
        const start = typed.current.text.length === 1 ? 1 : 0;
        const match = ordered
            .slice(start)
            .concat(ordered.slice(0, start))
            .find((index) => options[index]!.label.toLowerCase().startsWith(typed.current.text));
        if (match !== undefined) {
            if (open) {
                setActive(match);
            } else {
                onValueChange(options[match]!.value);
            }
        }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const last = options.length - 1;
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp": {
                event.preventDefault();
                if (!open) {
                    openList();
                    return;
                }
                const step = event.key === "ArrowDown" ? 1 : -1;
                setActive((current) => Math.max(0, Math.min(last, current + step)));
                return;
            }
            case "Home":
            case "End":
                if (open) {
                    event.preventDefault();
                    setActive(event.key === "Home" ? 0 : last);
                }
                return;
            case "Enter":
            case " ":
                event.preventDefault();
                if (open) {
                    commit(active);
                } else {
                    openList();
                }
                return;
            case "Escape":
                if (open) {
                    event.preventDefault();
                    close(true);
                }
                return;
            case "Tab":
                if (open) {
                    setOpen(false);
                }
                return;
            default:
                if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
                    typeAhead(event.key);
                }
        }
    };

    return (
        <div
            ref={rootRef}
            className={["dropdown", className].filter(Boolean).join(" ")}
            onBlur={(event) => {
                if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
                    setOpen(false);
                    onBlur?.();
                }
            }}
        >
            <input type="hidden" name={name} value={value} />
            <button
                ref={triggerRef}
                id={id}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={open ? listId : undefined}
                aria-activedescendant={open ? optionId(active) : undefined}
                aria-describedby={describedBy}
                aria-invalid={invalid ? true : undefined}
                aria-required={required ? true : undefined}
                data-placeholder={selected ? "false" : "true"}
                className="dropdown-trigger field-control"
                onClick={() => (open ? close(false) : openList())}
                onKeyDown={onKeyDown}
            >
                <span className="dropdown-value">{selected ? selected.label : placeholder}</span>
                <Chevron />
            </button>

            {open ? (
                <ul
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    tabIndex={-1}
                    className="dropdown-list"
                    data-placement={placement}
                >
                    {options.map((option, index) => (
                        <li
                            key={option.value || "empty"}
                            id={optionId(index)}
                            role="option"
                            aria-selected={index === selectedIndex}
                            data-active={index === active}
                            className="dropdown-option"
                            // Keep focus on the trigger so the field never reports a blur.
                            onMouseDown={(event) => event.preventDefault()}
                            onMouseMove={() => setActive(index)}
                            onClick={() => commit(index)}
                        >
                            <span>{option.label}</span>
                            {index === selectedIndex ? <Check /> : null}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
