import { ALL_CATEGORY } from "@/lib/projects/filter";

type ProjectFilterProps = {
    categories: string[];
    activeCategory: string;
    onChange: (category: string) => void;
};

export function ProjectFilter({ categories, activeCategory, onChange }: ProjectFilterProps) {
    const options = [ALL_CATEGORY, ...categories];
    return (
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
            {options.map((category) => {
                const pressed = category === activeCategory;
                return (
                    <button
                        key={category}
                        type="button"
                        aria-pressed={pressed}
                        onClick={() => onChange(category)}
                        className={[
                            "min-h-10 rounded-sm border px-4 text-small font-medium transition-colors",
                            pressed
                                ? "border-ink bg-ink text-white"
                                : "border-rule bg-transparent text-body hover:border-ink hover:text-ink",
                        ].join(" ")}
                    >
                        {category === ALL_CATEGORY ? "All projects" : category}
                    </button>
                );
            })}
        </div>
    );
}
