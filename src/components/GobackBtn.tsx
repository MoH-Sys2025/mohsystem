import {Button} from "./ui/button.tsx";
import {ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function GobackBtn (){
    const navigate = useNavigate();
    return(
        <Button size="xs" className="p-1 bg-neutral-700 w-19 text-[10px] rounded-full m-1"
                onClick={()=>{navigate(-1)}}>
            <ArrowLeft className="text-white" />Go Back
        </Button>
    )
}