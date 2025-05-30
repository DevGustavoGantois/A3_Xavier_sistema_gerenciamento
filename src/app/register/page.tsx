import { RegisterForm } from "@/components/c-register-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Register() {
    return (
        <section className="mt-20 lg:mt-60 max-w-[900px] mx-auto p-8 lg:p-0">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Cadastre-se</CardTitle>
                    <CardDescription>Cadastre-se para ter acesso a nossa plataforma.</CardDescription>
                </CardHeader>
                 <CardContent>
                        <RegisterForm />
                    </CardContent>
            </Card>
            <div className="pt-10 lg:pt-32 flex items-center justify-center">
          <Button variant="ghost" asChild>
            <Link href="/">
            Voltar  
            </Link>
          </Button>
        </div>
        </section>
    )
}