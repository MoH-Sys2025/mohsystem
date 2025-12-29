import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {UploadIcon} from "lucide-react";

// 1. Schema validation
const formSchema = z.object({
    uploadedBy: z.string().min(1, "Uploaded by is required"),
    type: z.enum(["Protocol", "Guidelines", "Report", "Training"]),
    documentName: z.string().min(1, "Document name is required"),
    status: z.string().default("Active"),
});

// 2. Component
export default function UploadDocumentForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            uploadedBy: "",
            type: undefined,
            documentName: "",
            status: "Active",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Submitted values:", values);
        // TODO: handle upload logic / API call
    };

    return (
        <div className="p-2 md:p-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 max-w-md"
                >
                    {/* Uploaded By */}
                    <FormField
                        control={form.control}
                        name="uploadedBy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Uploaded By</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Type */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Protocol">Protocol</SelectItem>
                                        <SelectItem value="Guidelines">Guidelines</SelectItem>
                                        <SelectItem value="Report">Report</SelectItem>
                                        <SelectItem value="Training">Training</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Document Name */}
                    <FormField
                        control={form.control}
                        name="documentName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Document Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Cholera Response Guidelines" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Status (Disabled, default Active) */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type="submit"><UploadIcon /> Upload Document</Button>
                </form>
            </Form>
        </div>
    );
}
