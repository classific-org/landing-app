import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorScreen } from "@/components/errors/ErrorScreen";

type AppErrorBoundaryProps = { children: ReactNode };
type AppErrorBoundaryState = { failed: boolean; error: unknown };

/**
 * Last line of defence around the whole app. The router's own error boundary handles route
 * failures; this one catches anything thrown outside a route, such as in the providers.
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
    state: AppErrorBoundaryState = { failed: false, error: null };

    static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
        return { failed: true, error };
    }

    componentDidCatch(error: unknown, info: ErrorInfo) {
        console.error("Unhandled application error", error, info.componentStack);
    }

    render() {
        return this.state.failed ? <ErrorScreen error={this.state.error} /> : this.props.children;
    }
}
