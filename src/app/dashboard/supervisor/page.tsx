"use client";
import { DialogTask } from "@/components/c-dialog-task";
import OnlyFor from "@/components/OnlyFor";
import { Button } from "@/components/ui/button";
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
import axios from "axios";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  name: string;
  supervisor: string;
  employee: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  position: string;
}

export default function SupervisorDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get<User>("http://localhost:8000/user");
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }
    fetchUser();
  })

  useEffect(() => {
    async function fetchTasks() {
      try {
        const userName = user?.name;
        const response = await axios.post<Task[]>(
          "http://localhost:8000/task/filter",
          { supervisor: userName }
        );
        console.log("Resposta da API:", response.data);
        setTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    }

      fetchTasks();

  }, [user]);

  const [dialog, setDialog] = useState(false);

  return (
    <OnlyFor roleAllowed={["gerente"]}>
      <div className="p-6 space-y-6">
        <div className="flex flex-col justify-center lg:justify-between lg:flex-row">
          <h1 className="text-2xl font-bold">Relatórios do Supervisor</h1>
          <Button className="cursor-pointer" variant="outline" type="button" onClick={() => setDialog(true)}>Criar Tarefa</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tarefas Cadastradas por {user?.name}</CardTitle>
          </CardHeader>
          <CardContent>
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
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.id}</TableCell>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{task.supervisor}</TableCell>
                      <TableCell>{task.employee}</TableCell>
                      <TableCell>{task.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>Nenhuma tarefa encontrada.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <DialogTask open={dialog} setOpen={setDialog}/>
    </OnlyFor>
  );
}
