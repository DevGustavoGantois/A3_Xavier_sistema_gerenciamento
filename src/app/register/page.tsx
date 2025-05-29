import { RegisterForm } from "@/components/c-register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
    return (
        <section className="mt-40 lg:mt-60 max-w-[900px] mx-auto p-8 lg:p-0">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Cadastre-se</CardTitle>
                    <CardDescription>Cadastre-se para ter acesso a nossa plataforma.</CardDescription>
                    <CardContent>
                        <RegisterForm />
                    </CardContent>
                </CardHeader>
            </Card>
        </section>
    )
}