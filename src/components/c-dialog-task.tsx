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
  FormMessage,
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

interface DialogTaskProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  supervisor: string;
}

export function DialogTask({ open, setOpen, supervisor }: DialogTaskProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(5, "Este campo precisa ter no mínimo 5 caracteres..."),
    supervisor: z.string(),
    employee: z.string().optional(),
    status: z.string().optional(),
  });

  type FormDataSchema = z.infer<typeof formSchema>;

  const form = useForm<FormDataSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      employee: "",
      status: "",
      supervisor: supervisor,
    },
  });

  useEffect(() => {
    form.setValue("supervisor", supervisor);
  }, [supervisor, form]);

  function onSubmit(value: FormDataSchema) {
    setIsLoading(true);
    axios
      .post("http://localhost:8000/task/create", value)
      .then((response) => {
        console.log("Chamando a API:", response.data);
        setOpen(false); 
        form.reset(); 
      })
      .catch((error) => {
        console.log("Erro ao chamar a API:", error);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Tarefa</DialogTitle>
          <DialogDescription>Preencha os campos abaixo.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Campo oculto para supervisor */}
            <FormField
              name="supervisor"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" className="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da atividade</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Digite o nome da tarefa..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="employee"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do funcionário</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Digite o nome do funcionário..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-4 cursor-pointer">
              {isLoading ? "Criando tarefa..." : "Criar tarefa"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
