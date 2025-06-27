"use client"

import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { PatientForm } from "../patient-form"
import { useState } from "react"
import { z } from "zod"
import { formSchema } from "../patient-form"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
interface PatientProfileProps {
    patientId: Id<"patients">
}

export default function PatientProfile({ patientId }: PatientProfileProps) {
    const [isEditing, setIsEditing] = useState(false)
    const updatePatient = useMutation(api.patients.updatePatient)
    const patient = useQuery(api.patients.getPatient, {
        patientId,
    })

    if (!patient) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col gap-4 m-16">
            <div className="flex flex-col gap-2 items-start">
                <div className="flex flex-row gap-2">
                    
                    <Link href="/" className="flex flex-row gap-2 items-center"><ChevronLeft />Back</Link>
                </div>
                
                <h1 className="text-2xl font-bold">Patient Profile</h1>
                <p className="text-lg font-bold">{patient.firstName} {patient.lastName}</p>
                Details:
                <p>Birth Date: {new Date(patient.dateOfBirth).toDateString()}</p>
                <p>Address: {patient.address}</p>
                <p>Status: {patient.status}</p>
                <p>Notes: {patient.notes}</p>
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                {isEditing && <PatientForm onClose={() => setIsEditing(false)} title="Edit Patient" buttonText="Save" defaultValues={{
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    dateOfBirth: new Date(patient.dateOfBirth),
                    address: patient.address,
                    status: patient.status,
                    notes: patient.notes,
                }} onSubmit={(data: z.infer<typeof formSchema>) => {
                    updatePatient({
                        patientId,
                        patient: {
                            ...data,
                            dateOfBirth: data.dateOfBirth.toLocaleDateString(),
                        },
                    })
                    setIsEditing(false)
                }} />}
            </div>
        </div>
  )
}
