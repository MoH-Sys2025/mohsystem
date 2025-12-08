import type {JSX} from "react";
import ExcelUploader from "@/components/AddHCWExcel.tsx";

interface AddWorkerProps {
    onNavigate: (page: string) => void;
}

export function AddWorker({onNavigate}: AddWorkerProps): JSX.Element {
    return(
        <div>
            <ExcelUploader />
        </div>
    )
}