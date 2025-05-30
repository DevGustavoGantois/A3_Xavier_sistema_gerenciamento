import OnlyFor from "@/components/OnlyFor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ManagerDashboard() {
  return (
    <OnlyFor roleAllowed={["gerente"]}>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Relatórios do Gerente</h1>

        {/* Tarefas Cadastradas pelo Supervisor */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Cadastradas por Supervisores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Limpeza de Setor A</TableCell>
                  <TableCell>João Silva</TableCell>
                  <TableCell>Pendente</TableCell>
                </TableRow>
                {/* Adicionar mais linhas mockadas */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tarefas Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Limpeza de Setor A - João Silva</li>
              <li>Organização do Estoque - Maria Souza</li>
            </ul>
          </CardContent>
        </Card>

        {/* Funcionários sem Tarefas Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionários sem Tarefas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Felipe Andrade</li>
              <li>Larissa Lima</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </OnlyFor>
  );
}
