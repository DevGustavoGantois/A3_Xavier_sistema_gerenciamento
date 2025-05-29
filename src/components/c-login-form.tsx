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

export function LoginForm() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const route = useRouter();

    const formSchema = z.object({
        name: z.string().min(5, "Este campo precisa ter no mínimo 5 caracteres...").max(20, "Este campo não pode ter mais que 20 caracteres..."),
        password: z.string().min(8, "A sua senha precisa ter no mínimo 8 caracteres...").max(16, "A senha pode ter no máximo 16 caracteres..."),
    })

    type FormDataSchema = z.infer<typeof formSchema>;

    const form = useForm<FormDataSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            password: "",
        }
    })

    const onSubmit = (value: FormDataSchema) => {
        setIsLoading(true);
         axios.post("https://endpointDaAPI", value)
         .then((response) => {
            console.log("Resposta da API", response.data);
            setTimeout(() => {
                route.push("/dashboard")
            }, 2000);
         }).catch((error) => {
            console.log("Erro na API", error)
            setTimeout(() => {
                route.refresh();   
            }, 2000)
         })
         setIsLoading(false); 
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField name="name" control={form.control} render={({field}) => (
                        <FormItem className="flex flex-col gap-3">
                            <FormLabel>Nome de usuário</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Digite seu nome de usuário..."
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