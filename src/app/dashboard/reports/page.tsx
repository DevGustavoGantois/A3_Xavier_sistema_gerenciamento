"use client";
import OnlyFor from "@/components/OnlyFor";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

interface Task {
  id: number;
  name: string;
  supervisor: string;
  employee: string;
  status: string;
}

export default function ManagerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  const fetchReport = async (type: string) => { //As rotas estão erradas:
    let url = "";
    let filter : {[key: string]: string} = {};

    switch (type) {
      case "supervisor":
        url = "http://localhost:8000/task/get";
        setTitle("Tarefas Cadastradas por Supervisores");
        break;
      case "pending":
        url = "http://localhost:8000/task/filter";
        filter = { status: "Pendente" };
        setTitle("Tarefas Pendentes");
        break;
      case "noPending":
        url = "http://localhost:8000/task/no-pending";
        setTitle("Funcionários sem Tarefas Pendentes");
        break;
    }

    try {
      let response;
      if (type === "pending") {
        response = await axios.post<Task[]>(url, filter);
      } else {
        response = await axios.get<Task[]>(url);
      }

      if (response.data.length === 0) {
        setTasks([]);
        setMessage("Nenhum dado encontrado para este relatório.");
      } else {
        setTasks(response.data);
        setMessage("");
      }
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
      setTasks([]);
      setMessage("Erro ao buscar dados.");
    }
  };

  return (
    <OnlyFor roleAllowed={["gerente"]}>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Relatórios do Gerente</h1>

        <div className="flex flex-wrap gap-4">
          <Button className="cursor-pointer" variant="secondary" onClick={() => fetchReport("supervisor")}>
            Tarefas por Supervisores
          </Button>
          <Button className="cursor-pointer" variant="secondary" onClick={() => fetchReport("pending")}>
            Tarefas Pendentes
          </Button>
          <Button className="cursor-pointer" variant="secondary" onClick={() => fetchReport("noPending")}>
            Funcionários sem Pendências
          </Button>
        </div>

        {title && (
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              {message ? (
                <p className="text-sm text-muted-foreground">{message}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.id}</TableCell>
                        <TableCell>{task.name}</TableCell>
                        <TableCell>{task.supervisor}</TableCell>
                        <TableCell>{task.employee}</TableCell>
                        <TableCell>{task.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </OnlyFor>
  );
}
