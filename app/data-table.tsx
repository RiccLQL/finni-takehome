"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  FilterFnOption,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Plus, Trash } from "lucide-react"
import { PatientForm } from "./patient-form"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Patient } from "./columns"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { formSchema } from "./patient-form"
import { Filters } from "./filters"
import { rankItem } from "@tanstack/match-sorter-utils"
import { Input } from "@/components/ui/input"
import { partial_ratio } from "fuzzball"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<Patient, any>) {
  const router = useRouter()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState<any>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) 
  const [isNewPatientFormOpen, setIsNewPatientFormOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const customFilterFn: FilterFnOption<Patient> = (row, columnId, filterValue, addMeta) => {
    // custom filter logic
    if (filterValue.length < 3) {
      return true
    }
    const rank = partial_ratio(row.getAllCells().map((cell) => cell.getValue()).join(" "), filterValue)
    addMeta({ rank })
    return rank > 60
  }

  const table = useReactTable<Patient>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    globalFilterFn: customFilterFn,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    state: {
      pagination,
      sorting,
      globalFilter: globalFilter,
      rowSelection,
      columnFilters,
    },
    getRowId: (originalRow) => originalRow._id,
  })

  const deletePatients = useMutation(api.patients.deletePatients)
  const updatePatient = useMutation(api.patients.updatePatient)
  async function handleDelete() {
    await deletePatients({
      patientIds: table.getFilteredSelectedRowModel().rows.map((row) => row.id) as Id<"patients">[],
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <Input
              placeholder="Quick Search"
              className="max-w-sm max-h-8"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <div className="flex items-center gap-2">
              {table.getFilteredSelectedRowModel().rows.length === 1 && (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  Edit <Pencil />
                </Button>
              )}
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  Delete <Trash />
                </Button>
              )}
              {table.getFilteredSelectedRowModel().rows.length === 0 && (
                <Button size="sm" onClick={() => setIsNewPatientFormOpen(true)}>
                  Add Patient <Plus />
                </Button>
              )}
            </div>
          </div>
          <Filters table={table} />
        </div>
      </div>
      {isNewPatientFormOpen && <PatientForm onClose={() => setIsNewPatientFormOpen(false)} />}
      {isEditing && <PatientForm onClose={() => setIsEditing(false)} title="Edit Patient" buttonText="Save" defaultValues={{
          firstName: table.getFilteredSelectedRowModel().rows[0].original.firstName,
          lastName: table.getFilteredSelectedRowModel().rows[0].original.lastName,
          dateOfBirth: new Date(table.getFilteredSelectedRowModel().rows[0].original.dateOfBirth),
          address: table.getFilteredSelectedRowModel().rows[0].original.address,
          status: table.getFilteredSelectedRowModel().rows[0].original.status,
          notes: table.getFilteredSelectedRowModel().rows[0].original.notes,
      }} onSubmit={(data: z.infer<typeof formSchema>) => {
          updatePatient({
              patientId: table.getFilteredSelectedRowModel().rows[0].original._id,
              patient: {
                  ...data,
                  dateOfBirth: data.dateOfBirth.toLocaleDateString(),
              },
          })
          setIsEditing(false)
      }} />}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn(cell.column.id === "select" ? "cursor-default" : "cursor-pointer")}
                      key={cell.id}
                      onClick={() => cell.column.id === "select" ? null : router.push(`/${row.original._id}`)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-muted-foreground flex-1 text-sm p-2">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  )
}
