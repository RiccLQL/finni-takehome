"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { api } from "../convex/_generated/api";
import { useQuery } from "convex/react";

export default function PatientsTable() {
  const data = useQuery(api.patients.getPatients, {});

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 m-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Patients</h1>
        <p className="text-sm text-gray-500">
          This is a list of all the patients in the system.
        </p>
      </div>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
