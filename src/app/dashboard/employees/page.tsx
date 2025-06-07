"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

interface EmployeeDataTaskProps {
  id: string;
  name: string;
  supervisor: string;
  employee: string;
  status: string;
}

interface NotificationTaskEmployeeProps {
  id: string;
  description: string;
}

interface User {
  id: number;
  name: string;
}

export default function EmployeeDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isEmployeeData, setIsEmployeeData] = useState<EmployeeDataTaskProps[]>([]);
  const [isNotificationTask, setNotificationTask] = useState<NotificationTaskEmployeeProps[]>([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get<User>("http://localhost:8000/user");
        setUser(res.data);
      } catch (err) {
        console.log("Erro ao buscar usuário:", err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchDataTasks() {
      if (user) {
        try {
          const res = await axios.get(`http://localhost:8000/task/employee/${user.id}`);
          setIsEmployeeData(res.data);
        } catch (err) {
          console.log("Erro ao chamar a API:", err);
        }
      }
    }
    fetchDataTasks();
  }, [user]);

  useEffect(() => {
    async function fetchNotificationData() {
      if (user) {
        try {
          const res = await axios.get(`http://localhost:8000/notification/${user.id}`);
          setNotificationTask(res.data);
        } catch (err) {
          console.log("Erro na API:", err);
        }
      }
    }
    fetchNotificationData();
  }, [user]);

  async function handleFinishTask(taskId: string) {
    try {
      await axios.post(`http://localhost:8000/task/finish/${taskId}`);
      // Atualiza a lista após concluir
      if (user) {
        const updatedTasks = await axios.get(`http://localhost:8000/task/employee/${user.id}`);
        setIsEmployeeData(updatedTasks.data);
      }
    } catch (error) {
      console.log("Erro ao concluir tarefa:", error);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tarefas atribuídas</CardTitle>
        </CardHeader>
        <CardContent>
          {isEmployeeData.filter(task => task.status === "Pendente").map((task, index) => (
            <div key={index}>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>{task.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{task.status}</Badge>
                    <Button
                      size="sm"
                      onClick={() => handleFinishTask(task.id)}
                    >
                      Concluir
                    </Button>
                  </div>
                </li>
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tarefas concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          {isEmployeeData.filter(task => task.status === "Concluído").map((task, index) => (
            <div key={index}>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>{task.name}</span>
                  <Badge variant="default">{task.status}</Badge>
                </li>
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          {isNotificationTask.map((notification, id) => (
            <div key={id}>
              <ul className="list-disc ml-4 text-sm text-muted-foreground">
                <li>{notification.description}</li>
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
