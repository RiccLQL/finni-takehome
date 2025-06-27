"use client"
 
import { Column, ColumnDef } from "@tanstack/react-table"
import { Doc } from "../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { differenceInYears } from "date-fns"
import { rankItem } from "@tanstack/match-sorter-utils"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Patient = Doc<"patients">

const SortableHeader = (header: string) => ({ column }: { column: Column<Patient> }) => {
    return (
        <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {header}
            <ArrowUpDown className="h-3 w-3" />
        </div>
    )
}
 
export const columns: ColumnDef<Patient>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
  {
    accessorKey: "firstName",
    header: SortableHeader("First Name"),
  },
  {
    accessorKey: "lastName",
    header: SortableHeader("Last Name"),
  },
  {
    accessorKey: "middleName",
    header: SortableHeader("Middle Name"),
  },
  {
    accessorKey: "dateOfBirth",
    header: SortableHeader("Date of Birth"),
  },
  {
    accessorKey: "address",
    header: SortableHeader("Address"),
  },
  {
    accessorKey: "status",
    header: SortableHeader("Status"),
  },
  {
    accessorKey: "notes",
    header: SortableHeader("Notes"),
    cell: ({ row }) => {
      return (
        <div className="max-w-[100px] truncate">
          {row.original.notes}
        </div>
      )
    },
  },
]
