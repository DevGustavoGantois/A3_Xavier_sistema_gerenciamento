import { LoginForm } from "@/components/c-login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mt-20 lg:mt-60 p-8 lg:p-0 max-w-[800px] mx-auto flex flex-col justify-between">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Log in</CardTitle>
            <CardDescription>Preencha os campos abaixo para entrar no nosso sistema de gerenciamento de serviços.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        <div className="pt-10 lg:pt-80 flex items-center justify-center">
          <Button variant="ghost" asChild>
            <Link href="/register">
            Cadastrar-se
            </Link>
          </Button>
        </div>
    </div>  
  );
}
