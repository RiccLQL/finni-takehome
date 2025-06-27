import { Input } from "@/components/ui/input"
import { ColumnDef, Table } from "@tanstack/react-table"
import { Patient, columns as columnDefs } from "@/app/columns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterProps {
  table: Table<Patient>
  onRemove: (id: string) => void
  id: string
}

export function Filter({ table, onRemove, id }: FilterProps) {

    const columns = table.getAllColumns().filter((column) => column.id !== "select")

    const [column, setColumn] = useState<ColumnDef<Patient>>(columns[0])
    const [value, setValue] = useState<string>("")

    // Helper function to get header text from column definition
    const getHeaderText = (columnId: string) => {
        const headerMap: Record<string, string> = {
            'firstName': 'First Name',
            'lastName': 'Last Name',
            'middleName': 'Middle Name',
            'dateOfBirth': 'Date of Birth',
            'address': 'Address',
            'status': 'Status',
            'notes': 'Notes'
        };
        return headerMap[columnId] || columnId;
    };

    return (
        <div className="flex items-center gap-2">
            <Select defaultValue={column.id} onValueChange={(value) => setColumn(columns.find((column) => column.id === value) as ColumnDef<Patient>)}>
                <SelectTrigger className="max-h-8">
                    <SelectValue placeholder="Search..." />
                </SelectTrigger>
                <SelectContent>
                    {columns.map((column) => (
                        <SelectItem key={column.id} value={column.id}>{getHeaderText(column.id)}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                value={value}
                onChange={(event) => {
                    if (column.id) {
                        setValue(String(event.target.value))
                        table.getColumn(column.id)?.setFilterValue(String(event.target.value))
                    }
                }}
                className="max-w-sm max-h-8"
            />
            <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                    if (column.id) {
                        table.getColumn(column.id)?.setFilterValue(undefined)
                    }
                    onRemove(id)
                }}>
                    <X/>
                </Button>
        </div>
    )
}
