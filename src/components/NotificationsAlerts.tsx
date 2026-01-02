import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
} from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info";

type AlertOptions = {
    title: string;
    description: string;
    type?: AlertType;
    duration?: number;
};

const alertConfig: Record<
    AlertType,
    {
        label: string;
        icon: JSX.Element;
        badgeClass: string;
    }
> = {
    success: {
        label: "Success",
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        badgeClass: "bg-green-100 text-green-700 border-green-200",
    },
    error: {
        label: "Error",
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        badgeClass: "bg-red-100 text-red-700 border-red-200",
    },
    warning: {
        label: "Warning",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
        badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    info: {
        label: "Info",
        icon: <Info className="h-5 w-5 text-blue-600" />,
        badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    },
};

export  function AlertPopup({
                        title,
                        description,
                        type = "info",
                        duration = 3000,
                        onClose,
                    }: AlertOptions & { onClose: () => void }) {
    const config = alertConfig[type];

    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2">
            <Alert className="w-[360px] shadow-lg border flex gap-3">
                {config.icon}

                <div className="flex-1">
                    <AlertTitle className="flex items-center gap-2">
                        {title}
                        <Badge
                            variant="outline"
                            className={`text-xs px-2 py-0.5 ${config.badgeClass}`}
                        >
                            {config.label}
                        </Badge>
                    </AlertTitle>

                    <AlertDescription className="mt-1">
                        {description}
                    </AlertDescription>
                </div>
            </Alert>
        </div>
    );
}

export function showAlert({
                              title,
                              description,
                              type = "info",
                              duration = 3000,
                          }: AlertOptions) {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
        root.unmount();
        container.remove();
    };

    root.render(
        <AlertPopup
            title={title}
            description={description}
            type={type}
            duration={duration}
            onClose={cleanup}
        />
    );
}
