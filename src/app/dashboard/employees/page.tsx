// src/app/dashboard/employee/page.tsx

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeeDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Pedidos atribuídos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>#12345</span>
              <Badge variant="default">Em andamento</Badge>
            </li>
            <li className="flex justify-between items-center">
              <span>#12346</span>
              <Badge variant="secondary">Concluído</Badge>
            </li>
            <li className="flex justify-between items-center">
              <span>#12347</span>
              <Badge variant="destructive">Cancelado</Badge>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Turno de Trabalho</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Entrada: 08:00</p>
          <p>Saída: 17:00</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-4 text-sm text-muted-foreground">
            <li>Reunião com o supervisor às 14h</li>
            <li>Atualize o status dos pedidos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
