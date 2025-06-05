import { string, z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface DialogTaskProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function DialogTask({ open, setOpen}: DialogTaskProps) {
    
    const formSchema = z.object({
        name: z.string().min(5, "Este campo precisa ter no mínimo 5 caracteres..."),
        employee: z.string().optional(),
        status: z.string().optional()
    })

    type FormDataSchema = z.infer<typeof formSchema>

    const form = useForm<FormDataSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            employee: "",
            status: ""
        }
    })
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Criar Tarefa</DialogTitle>
                    <DialogDescription>
                        Preencha os campos abaixo.
                    </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...form}>

                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
} 