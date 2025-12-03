import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Briefcase,
    Calendar,
    LucideMail,
    LucideMailX,
    LucideMailbox,
    Link2, Edit3, BriefcaseMedical, Link2Icon, LinkIcon
} from "lucide-react";
import DeploymentSummary from "@/components/DeploymentSummary.tsx";
import {PerfomanceBarChart, CompetencyRadarChart} from "@/components/UserCharts.tsx";
import {TrainingSection} from "@/components/Trainings.tsx";
import {Button} from "@/components/ui/button.tsx";
import {api, formatDate, getAge} from "@/supabase/Functions.tsx";
import React from "react";
import {Badge} from "@/components/ui/badge.tsx";

export default function HealthWorkerProfile() {
    const [worker, setWorker] = React.useState(null);
    const [age, setAge] = React.useState(0)
    const [status, setStatus] = React.useState([])
    const [linkedSystems, setLinks] = React.useState([])
    const [cadle, setCadle] = React.useState("")
    React.useEffect(() => {
        const load = async () => {
            const data = await api.getPersonnelById("e25f4d82-d420-4e0a-9817-be114769538b");

            if (!data) return;

            // Compute age
            const dBirth = getAge(data.date_of_birth);

            // Update worker first
            setWorker(data);

            // Set system links correctly
            setLinks([
                ["DHIS2", data.dhis2_sync],
                ["IHRMIS", data.ihrmis_sync]
            ]);

            setAge(dBirth);

            // Load cadre data (must await, must use data.cadre_id)
            if (data.cadre_id) {
                const cadreData = await api.listCadresEq(data.cadre_id);

                if (cadreData && cadreData.length > 0) {
                    setCadle(cadreData[0].name);
                    console.log("Cadre:", cadreData[0].name);
                }
            }
        };

        load();
    }, []);


    const barcharts = [
        <div className="lg:w-3/12 p-4 text-xs space-y-2 border shadow-sm border-neutral-200 rounded-lg">
            <div className="font-semibold">Tasks</div>
            <div className="space-y-1 space-x-2">
                <Button size="xs" variant="outline" className="p-2 py-0">Assign to Trainings</Button>
                <Button size="xs" variant="outline" className="p-2 py-0">Message</Button>
                <Button size="xs" variant="outline" className="p-2 py-0">Edit Profile</Button>

            </div>
        </div>,
        <div className="lg:w-3/12">
            <PerfomanceBarChart />
        </div>,
        <div className="lg:w-3/12">
            <CompetencyRadarChart />
        </div>,
        <div className="lg:w-3/12">
            <PerfomanceBarChart />
        </div>
    ]
    const imgSrc = "https://randomuser.me/api/portraits/women/44.jpg"

    const competencies = [
        "Epidemiology & Outbreak Investigation",
        "Case Management & Triage",
        "Vaccination & Cold Chain Handling",
        "Community Health Surveillance"
    ]

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-full w-full grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Profile Card */}
                <Card className=" lg:col-span-3 col-span-1 overflow-y-hidden m-1 rounded-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold flex flex-row gap-2 items-center">Health Worker Profile<Edit3 className="ml-auto mt-1" size={14} /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={imgSrc}
                                alt="Profile"
                                className="w-32 h-32 rounded-full shadow mb-4"
                            />
                            <h2 className="text-lg font-semibold flex-row flex items-center gap-2">{worker?.first_name} {worker?.last_name} </h2>
                            <p className="text-neutral-500 mb-4">{cadle}</p>

                            <div className="space-y-3 text-sm w-full text-left">
                                <div className="flex items-center gap-2"><User size={16}/> {worker?.gender}, Age {age}</div>
                                <div className="flex items-center gap-2"><Phone size={16}/> {worker?.phone}</div>
                                <div className="flex justify-start gap-2 flex-column">
                                    {linkedSystems.map((linkData, index)=>(
                                        !linkData[1] && <div key={index} className="flex gap-2 text-gray-800 text-xs h-5">
                                            <LinkIcon size={16} />{linkData[0]}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2"><BriefcaseMedical size={16} />
                                    {worker?.metadata?.worker_status.map((status, index)=>(
                                        <Badge key={index} className=" bg-emerald-300 hover:bg-emerald-300 text-gray-800 font-semibold h-5 text-center"  >{status}</Badge>
                                    ))}
                                </div>
                                <div className="flex flex-row items-center gap-2"><Mail size={16}/>{worker?.email} <LucideMailbox size={14} className="cursor-pointer text-green-500 font-semibold" /> </div>
                                <div className="flex items-center gap-2"><MapPin size={16}/>{worker?.metadata?.district}, Malawi</div>
                                <div className="flex items-center gap-2"><Briefcase size={16}/> Ministry of Health • EMT Certified</div>
                                <div className="flex items-center gap-2"><Calendar size={16}/> Joined: {formatDate(worker?.created_at)}</div>
                            </div>

                            {/*Qualifications*/}
                            <div className="mt-6 w-full text-left">
                                <h3 className="font-semibold mb-2">Qualifications</h3>

                                <ul className="text-sm flex flex-col text-neutral-700">
                                    {(!worker?.qualifications ||
                                        worker?.qualifications.length === 0) ? (
                                        <li className="text-neutral-500">No qualifications available</li>
                                    ) : (
                                        worker?.qualifications.map((item, index) => (
                                            <li key={index} className="py-1">
                                                <div className="  bg-gray-200 px-3 py-1 rounded-full">
                                                    {item}
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>

                            {/*Competencies*/}
                            <div className="mt-6 w-full text-left">
                                <h3 className="font-semibold mb-2">Competencies</h3>
                                <ul className="list-none list-disc ml-0 text-sm flex flex-col justify-start text-neutral-700">
                                    {worker?.metadata?.competencies?.length === 0 ? (
                                        <div className="text-gray-400">User has no competencies available</div>
                                    ) : (
                                        worker?.metadata?.competencies?.map((comp, index) => (
                                            <li key={index} className="py-1 w-full">
                                                <div className="bg-gray-200 px-3 py-1 rounded-full">
                                                    {comp}
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>

                            </div>

                            <div className="mt-6 w-full text-left">
                                <h3 className="font-semibold mb-2">Languages</h3>
                                <ul className="list-disc ml-5 text-sm text-neutral-700 space-y-1">
                                    {worker?.metadata.languages.map((language, index) => (
                                        <li key={index} className="py-1 w-full">{language}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance and Deployment */}
                <div className="lg:col-span-9 col-span-1 space-y-1 space-x-1 py-1 mx-1 md:mx-0">
                    <div className="flex flex-col md:flex-row gap-1">
                        {barcharts.map((bar, index) => (
                            <React.Fragment key={index}>{bar}</React.Fragment>
                        ))}
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-1">
                        <Card className="md:w-6/12 p-3 md:p-6 rounded-lg"><DeploymentSummary imgSrc={imgSrc}  /></Card>
                        <div className="md:w-6/12 rounded-none"><TrainingSection  /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

