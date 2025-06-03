"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z
  .object({
    name: z.string().min(5, "O nome precisa ter no mínimo 5 caracteres..."),
    email: z
      .string()
      .min(12, "O email precisa ter no mínimo 12 caracteres...")
      .email("E-mail inválido"),
      position: z.string().optional(),
    phone: z.string().min(10, "O telefone precisa ter no mínimo 10 dígitos..."),
    cpf: z.string().min(11, "O CPF precisa ter 11 dígitos..."),
    password: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres..."),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
  });

type FormDataSchema = z.infer<typeof formSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormDataSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (values: FormDataSchema) => {
    setIsLoading(true);
    axios
      .post("http://localhost:8000/register", values)
      .then((response) => {
        console.log("Resposta da API:", response.data);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch((error) => {
        console.log("Erro na API", error);
        setTimeout(() => {
          router.refresh();
        }, 2000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="exemplo@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(xx) xxxxx-xxxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="cpf"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input type="text" placeholder="xxx.xxx.xxx-xx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField name="position" control={form.control} render={({field}) => (
          <FormItem>
            <FormLabel>Cargo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu cargo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-full">
                <SelectItem value="Funcionário">Funcionário</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Gerente">Gerente</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )} />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Crie uma senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirme a senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="mt-6">
          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? "Carregando..." : "Cadastrar-se"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
