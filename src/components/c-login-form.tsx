"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function LoginForm() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const route = useRouter();

    const formSchema = z.object({
        email: z.string().min(8, "Este campo precisa ter no mínimo 8 caracteres...").email("Email inválido"),
        password: z.string().min(8, "A sua senha precisa ter no mínimo 8 caracteres...").max(16, "A senha pode ter no máximo 16 caracteres..."),
    })

    type FormDataSchema = z.infer<typeof formSchema>;

    const form = useForm<FormDataSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

        const onSubmit = async (value: FormDataSchema) => {
    setIsLoading(true);
    try {
        const response = await axios.post("http://localhost:8000/login", value);
        const { position } = response.data;

        console.log("Resposta da API", response.data);

        setTimeout(() => {
        if (position === "Gerente") {
            route.push("/dashboard/reports");
        } else if (position === "Supervisor") {
            route.push("/dashboard/supervisor");
        } else {
            route.push("/dashboard/employees");
        }
        }, 2000);
    } catch (error) {
        console.log("Erro na API", error);
        setTimeout(() => {
        route.refresh();
        }, 2000);
    } finally {
        setIsLoading(false);
    }
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField name="email" control={form.control} render={({field}) => (
                        <FormItem className="flex flex-col gap-3">
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Digite seu email..."
                                {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="password" control={form.control} render={({field}) => (
                        <FormItem className="flex flex-col gap-3 mt-3">
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input
                                 type="password"
                                 placeholder="Digite sua senha..."
                                 {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="mt-4">
                        <Button className="w-full cursor-pointer" type="submit" disabled={isLoading}>
                            {isLoading ? "Carregando..." : "Entrar"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}