import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";
import { padStep } from "@/lib/formatting/text";
import type { Service } from "@/types/content";

type ServiceIndexProps = {
    services: Service[];
    /** "grid" for the homepage, "list" for the services overview. */
    layout?: "grid" | "list";
    headingLevel?: "h2" | "h3";
};

export function ServiceIndex({ services, layout = "grid", headingLevel = "h3" }: ServiceIndexProps) {
    const Heading = headingLevel;

    if (layout === "list") {
        return (
            <ul className="divide-y divide-rule border-y border-rule">
                {services.map((service, index) => (
                    <li key={service.slug} className="grid gap-4 py-8 lg:grid-cols-12 lg:gap-8">
                        <div className="flex items-start gap-4 lg:col-span-4">
                            <span className="text-small tabular-nums text-body">
                                {padStep(index + 1)}
                            </span>
                            <Heading className="text-h3">
                                <Link
                                    to={`/services/${service.slug}`}
                                    className="transition-colors hover:text-body"
                                >
                                    {service.title}
                                </Link>
                            </Heading>
                        </div>
                        <p className="text-body text-body lg:col-span-5">{service.description}</p>
                        <div className="lg:col-span-3 lg:text-right">
                            <Link to={`/services/${service.slug}`} className="arrow-link text-small">
                                <span>Explore {service.navLabel}</span>
                                <Icon name="arrow-right" />
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <ul className="grid border-t border-rule sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service, index) => (
                <li
                    key={service.slug}
                    className="flex flex-col border-b border-rule py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:not(:first-child)]:pl-8"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-small tabular-nums text-body">
                            {padStep(index + 1)}
                        </span>
                        <Icon name={service.icon} className="h-5 w-5 text-ink" />
                    </div>
                    <Heading className="mt-10 text-h3">
                        <Link
                            to={`/services/${service.slug}`}
                            className="transition-colors hover:text-body"
                        >
                            {service.title}
                        </Link>
                    </Heading>
                    <p className="mt-4 flex-1 text-body text-body">{service.summary}</p>
                    <Link
                        to={`/services/${service.slug}`}
                        className="arrow-link mt-8 text-small"
                        aria-label={`Learn more about ${service.title}`}
                    >
                        <span>Learn more</span>
                        <Icon name="arrow-right" />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
