import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    GraduationCap,
    ChevronDown,
    ChevronUp, DotSquare, Square,
} from "lucide-react";

type Props = {
    trainings?: string[]; // matches worker.trainings
};

export function TrainingSection({ trainings = [] }: Props) {
    const [expanded, setExpanded] = useState(false);

    const visible = expanded ? trainings : trainings.slice(0, 3);

    return (
        <Card className="h-full">
            <CardHeader >
                <CardTitle className="flex items-center flex-row gap-2 justify-between text-sm font-semibold">
                    Trainings
                    <span className="flex items-center flex-row gap-2"><GraduationCap size={16} /> {trainings.length}</span>
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Separator />

                {/* LIST */}
                {trainings.length === 0 ? (
                    <p className="text-xs font-normal mt-3 text-muted-foreground">
                        No trainings assigned
                    </p>
                ) : (
                    <ul className="space-y-2 text-sm mt-3">
                        {visible.map((title, index) => (
                            <li
                                key={`${title}-${index}`}
                                className="pl-3 relative flex items-center gap-2"
                            >
                                <Square size={13} /><span className="font-normal">{title}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* SHOW MORE */}
                {trainings.length > 3 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="px-0 h-6 text-xs"
                        onClick={() => setExpanded(v => !v)}
                    >
                        {expanded ? (
                            <>
                                Show less <ChevronUp size={12} />
                            </>
                        ) : (
                            <>
                                Show more <ChevronDown size={12} />
                            </>
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
