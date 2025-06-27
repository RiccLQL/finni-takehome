import { ReactNode, useState } from "react";
import { Filter } from "./filter";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Patient } from "./columns";
import { v4 as uuidv4 } from 'uuid';

interface FiltersProps {
    table: Table<Patient>
}

export function Filters({ table }: FiltersProps) {

    const [filters, setFilters] = useState<string[]>([])

    function addFilter(filter: string) {
        setFilters([...filters, filter])
    }

    function removeFilter(id: string) {
        setFilters(filters.filter((f) => id !== f))
    }

    return (
        <div className="flex-col flex items-start gap-2">
            {filters.map((filter) => (
                <Filter key={filter} table={table} onRemove={(id) => removeFilter(id)} id={filter} />
            ))}
            <Button onClick={() => addFilter(uuidv4())} size="sm" variant="outline">Add Filter</Button>
        </div>
    )
}
