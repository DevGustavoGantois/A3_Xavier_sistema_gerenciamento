"use client";

import { Badge } from "@/components/ui/badge";
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
  name: string;
  supervisor: string;
  employee: string;
  status: string;
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
          const res = await axios.get(`http://localhost:8000/task/${user.name}/${user.id}`);
          console.log("Chamando os dados da API: ", res.data);
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
      try {
        const res = await axios.get("http://localhost:8000/task/notification");
        console.log("Chamando a API de notificação:", res.data);
        setNotificationTask(res.data);
      } catch (err) {
        console.log("Erro na API:", err);
      }
    }
    fetchNotificationData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tarefas atribuídas</CardTitle>
        </CardHeader>
        <CardContent>
          {isEmployeeData.map((task, index) => (
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
          {isNotificationTask.map((notification, index) => (
            <div key={index}>
              <ul className="list-disc ml-4 text-sm text-muted-foreground">
                <li>{notification.status}</li>
                <li>Atualize o status dos pedidos</li>
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
