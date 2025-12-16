import {ListStartIcon, TrendingDown, TrendingUp, User} from "lucide-react";
import type {ComponentType} from "react";

interface StartsProps {
    title: string;
    value: number;
    change: number;
    classData: string,
    icon: ComponentType<{ className?: string }>;
}


export function StartCard2({
                               title = "Start Card",
                               value = 0,
                               change = 0,
                                classData = "",
                               icon: Icon,
                           }: StartsProps) {
    return (
        <div className={`bg-white flex flex-col gap-1 rounded-lg border p-6 py-2 ${classData}`}>
            <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-neutral-700" />

                <div className="flex items-center gap-1 text-sm text-emerald-600">
                    {(change >= 0) ? <TrendingUp className="w-4 h-4" />: <TrendingDown className="w-4 h-4" />}
                    {change}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-600">
                    {title}
                </div>

                <div className="text-xl font-semibold text-neutral-900">
                    {value}
                </div>
            </div>
        </div>
    );
}
