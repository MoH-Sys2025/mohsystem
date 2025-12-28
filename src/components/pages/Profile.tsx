import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {useEffect, useState} from "react";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Briefcase,
    Calendar,
    LucideMailbox,
    Edit3, BriefcaseMedical, LinkIcon, Unlink
} from "lucide-react";
import DeploymentSummary from "@/components/DeploymentSummary.tsx";
import {PerfomanceBarChart, CompetencyRadarChart} from "@/components/UserCharts.tsx";
import {TrainingSection} from "@/components/Trainings.tsx";
import {Button} from "@/components/ui/button.tsx";
import {api, formatDate, getAge} from "@/supabase/Functions.tsx";
import React from "react";
import {Badge} from "@/components/ui/badge.tsx";
import {useSelectedMOHData} from "@/components/DataContext.tsx";

export default function HealthWorkerProfile() {

    const [worker, setWorker] = useState(null);
    const [age, setAge] = useState(0)
    const [status, setStatus] = useState([])
    const [linkedSystems, setLinks] = useState([])
    const [cadle, setCadle] = useState("")
    const { selectedMOHData } = useSelectedMOHData();
    const data = selectedMOHData;
    if (!data) return <p>No worker selected</p>;

    useEffect(() => {

        // Update worker first
        setWorker(data);
        setLinks([
            ["DHIS2", data.dhis2_sync],
            ["IHRMIS", data.ihrmis_sync]
        ]);

        setAge(data.metadata.age);

        const load = async () => {

            // Load cadre data (must await, must use data.cadre_id)
            if (data.cadre_id) {
                const cadreData = await api.listCadresEq(data.cadre_id);

                if (cadreData && cadreData.length > 0) {
                    setCadle(cadreData[0].name);
                }
            }
        };

        load();
    }, []);

    const capitalize = (name) => {
        if (!name) return "";
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    const barcharts = [
        <div className="md:col-span-6 lg:col-span-3 p-4 text-xs space-y-2 border shadow-sm border-neutral-200 rounded-lg">
            <div className="font-semibold">Quick Links</div>
            <div className="space-y-1 space-x-2 ">
                <Button size="xs" variant="outline" className="p-2 py-0">Documents</Button>
                <Button size="xs" variant="outline" className="p-2 py-0">Deploy</Button>
                <Button size="xs" variant="outline" className="p-2 py-0">Links</Button>
                <Button size="xs" variant="outline" className="p-2 py-0">Edit Profile</Button>
                <Button size="xs" variant="outline" className="p-2 py-0">Message</Button>
                <Button size="xs" variant="outline" className="p-2 py-0">Assign to Trainings</Button>

            </div>
        </div>,
        <div className="md:col-span-6 lg:col-span-3">
            <PerfomanceBarChart />
        </div>,
        <div className="md:col-span-6 lg:col-span-3">
            <CompetencyRadarChart />
        </div>,
        <div className="md:col-span-6 lg:col-span-3 flex-auto">
            <PerfomanceBarChart />
        </div>
    ]
    const imgSrc = (capitalize(worker?.gender) === 'Female') ? "portrait_Nurse.jpg":"male_nurse.png"
    return (
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-full w-full grid grid-cols-1 md:grid-cols-12 gap-0 ">
                {/* Profile Card */}
                <Card className=" md:col-span-4 col-span-1 overflow-y-hidden m-1 rounded-lg">
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
                            <p className="text-neutral-500">{cadle}</p>
                            <p className="text-sm mb-4">{worker?.role}</p>
                            <div className="space-y-3 text-sm w-full text-left">
                                <div className="flex items-center gap-2"><User size={16}/> {capitalize(worker?.gender)}, Age {age}</div>
                                <div className="flex items-center gap-2"><Phone size={16}/> {worker?.phone}</div>
                                <div className="flex justify-start gap-4 flex-column">
                                    {linkedSystems.map((linkData, index) => (
                                        <div
                                            key={`link-${index}`}
                                            className="flex gap-1 text-gray-800 justify-center items-center text-xs h-5"
                                        >
                                            {linkData[1] ? (
                                                <LinkIcon size={12} />
                                            ) : (
                                                <Unlink size={12} />
                                            )}
                                            {linkData[0]}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2"><BriefcaseMedical size={16} />
                                    {worker?.metadata?.worker_status.map((status, index)=>(
                                        <Badge key={`status-${index}`} className=" bg-emerald-300 hover:bg-emerald-300 text-gray-800 font-semibold h-5 text-center"  >{status}</Badge>
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
                                    {worker?.qualifications ? worker?.qualifications: "No qualifications are available"}
                                    {/*{(!worker?.qualifications ||*/}
                                    {/*    worker?.qualifications.length === 0) ? (*/}
                                    {/*    <li className="text-gray-400">No qualifications available</li>*/}
                                    {/*) : (*/}
                                    {/*    worker?.qualifications.map((item, index) => (*/}
                                    {/*        <li key={`qual-${index}`} className="py-1">*/}
                                    {/*            <div className="  bg-gray-200 px-3 py-1 rounded-full">*/}
                                    {/*                {item}*/}
                                    {/*            </div>*/}
                                    {/*        </li>*/}
                                    {/*    ))*/}
                                    {/*)}*/}
                                </ul>
                            </div>

                            {/*Competencies*/}
                            <div className="mt-6 w-full text-left">
                                <h3 className="font-semibold mb-2">Competencies</h3>
                                <ul className="list-none list-disc ml-0 text-sm flex flex-col justify-start text-neutral-700">
                                    {!worker?.metadata?.competencies || worker?.metadata?.competencies.length === 0 ? (
                                        <div className="text-gray-400">No competencies are available</div>
                                    ) : (
                                        worker.metadata.competencies.map((comp, index) => (
                                            <li key={`comp-${index}`} className="py-1 w-full">
                                                <div className="bg-gray-200 px-3 py-1 rounded-full">
                                                    {comp}
                                                </div>
                                            </li>
                                        ))
                                    )}

                                </ul>

                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Performance and Deployment */}
                <div className="md:col-span-8 col-span-1 space-y-1 space-x-1 py-1 md:mx-0">
                    <div className="md:grid md:grid-cols-12 gap-1">
                        {barcharts.map((bar, index) => (
                            <React.Fragment key={index}>{bar}</React.Fragment>
                        ))}
                    </div>
                    <div className="w-full flex flex-col lg:flex-row gap-1">
                        <Card className="w-full lg:w-6/12 p-3 md:p-6 rounded-lg"><DeploymentSummary imgSrc={imgSrc} worker={worker}  /></Card>
                        <div className="w-full lg:w-6/12 rounded-none"><TrainingSection  /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

