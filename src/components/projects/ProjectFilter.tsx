import { ALL_CATEGORY } from "@/lib/projects/filter";

type ProjectFilterProps = {
    categories: string[];
    activeCategory: string;
    onChange: (category: string) => void;
};

export function ProjectFilter({ categories, activeCategory, onChange }: ProjectFilterProps) {
    const options = [ALL_CATEGORY, ...categories];
    return (
        <div
            role="group"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-x-7 gap-y-2"
        >
            {options.map((category) => {
                const pressed = category === activeCategory;
                return (
                    <button
                        key={category}
                        type="button"
                        aria-pressed={pressed}
                        onClick={() => onChange(category)}
                        className="nav-link min-h-11 bg-transparent"
                    >
                        {category === ALL_CATEGORY ? "All projects" : category}
                    </button>
                );
            })}
        </div>
    );
}
