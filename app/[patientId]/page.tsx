import { Id } from "@/convex/_generated/dataModel"
import PatientProfile from "./patient-profile"

export default async function PatientPage({
  params,
}: {
  params: { patientId: string }
}) {
  return <PatientProfile patientId={params.patientId as Id<"patients">} />
}
