
import { ArrowRight } from "lucide-react";

export const GigSpaceLink = () => {
    return (
        <a
            href="#"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
        >
            <span>Coming Soon 🚀: GigSpace — The Network for Service Providers</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
    );
};
