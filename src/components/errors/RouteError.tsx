import { useRouteError } from "react-router";
import { ErrorScreen } from "@/components/errors/ErrorScreen";

/** Router error boundary: renders whenever a route fails to load or render. */
export function RouteError() {
    return <ErrorScreen error={useRouteError()} />;
}
