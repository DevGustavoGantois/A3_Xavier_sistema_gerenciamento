import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Employee } from "./c-dialog-task";

interface Task {
  id: number;
  name: string;
  employee: string;
  status: string;
  supervisor: string;
}

interface DialogEditTaskProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  supervisor: string;
  task: Task | null; 
  editTaskCreated: () => void;
}

export function DialogEditTask({
  open,
  setOpen,
  supervisor,
  task,
  editTaskCreated,
}: DialogEditTaskProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const formSchema = z.object({
    name: z.string().min(5, "Este campo precisa ter no mínimo 5 caracteres..."),
    supervisor: z.string().min(1, "Supervisor obrigatório"),
    employee: z.string().optional(),
    status: z.string().optional(),
  });

  type FormDataEditSchema = z.infer<typeof formSchema>;

  const form = useForm<FormDataEditSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      employee: "",
      status: "",
      supervisor: supervisor ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      axios
        .get("http://localhost:8000/employee/get")
        .then((res) => setEmployees(res.data))
        .catch(() => setEmployees([]));

      if (task) {
        form.setValue("name", task.name);
        form.setValue("employee", task.employee);
        form.setValue("status", task.status);
        form.setValue("supervisor", task.supervisor);
      }
    }
  }, [open, task, form, supervisor]);

  function onSubmit(values: FormDataEditSchema) {
    setIsLoading(true);
    axios
      .put(`http://localhost:8000/task/update/${task?.id}`, values)
      .then(() => {
        setOpen(false);
        form.reset();
        editTaskCreated();
      })
      .catch((error) => console.error("Erro ao atualizar tarefa:", error))
      .finally(() => setIsLoading(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>Altere os campos desejados.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <Input type="hidden" {...form.register("supervisor")} />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da atividade</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da tarefa" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="employee"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funcionário</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um funcionário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.name}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-4 cursor-pointer">
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
