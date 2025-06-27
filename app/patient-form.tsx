import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { Asterisk, CalendarIcon, X } from "lucide-react"
import schema from "@/convex/schema"
import { convexToZod } from "convex-helpers/server/zod"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"

export const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  status: convexToZod(schema.tables.patients.validator.fields.status),
  notes: z.string().optional(),
})

interface NewPatientFormProps {
    onClose: () => void;
    defaultValues?: z.infer<typeof formSchema>;
    title?: string;
    buttonText?: string;
    onSubmit?: (data: z.infer<typeof formSchema>) => void;
}

export function PatientForm({ onClose, title = "New Patient", buttonText = "Add Patient", defaultValues, onSubmit }: NewPatientFormProps) {

    const addPatient = useMutation(api.patients.addPatient)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: defaultValues?.firstName || "",
            middleName: defaultValues?.middleName || "",
            lastName: defaultValues?.lastName || "",
            dateOfBirth: defaultValues?.dateOfBirth || new Date(),
            address: defaultValues?.address || "",
            status: defaultValues?.status || "Inquiry",
            notes: defaultValues?.notes || "",
        },
    })

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        if (onSubmit) {
            onSubmit(data)
        } else {
            addPatient({
                patient: {
                    ...data,
                    dateOfBirth: data.dateOfBirth.toLocaleDateString(),
                },
            })
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 flex-col bg-white z-50 m-16">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">
                    {title}
                </h2>
                <Button variant="ghost" onClick={onClose} className="">
                    <X />
                </Button>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-col">
                    <div className="flex flex-wrap w-full">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>First Name <Asterisk className="text-red-500 h-2 w-2" /></FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>Middle Name</FormLabel>  
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>Last Name <Asterisk className="text-red-500 h-2 w-2" /></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            rules={{ required: "Date of birth is required" }}
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-1/2 p-2">
                                    <FormLabel>Date of birth <Asterisk className="text-red-500 h-2 w-2" /></FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            captionLayout="dropdown"
                                            disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                            }
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    </FormItem>
                            )}
                        />      
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <FormLabel>Address <Asterisk className="text-red-500 h-2 w-2" /></FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main St, Anytown, USA" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />  
                        <FormField
                            control={form.control}
                            name="status"
                            rules={{ required: "Status is required" }}
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <FormLabel>Status <Asterisk className="text-red-500 h-2 w-2" /></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {schema.tables.patients.validator.fields.status.members.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>{status.value}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Notes" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end w-full p-2">
                        <Button type="submit">{buttonText}</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}