"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/auth/useAuth";


export function Navbar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pathname = usePathname();
  const { user } = useAuth(); 

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const commonLinks = [
    { href: "/dashboard", label: "Início" },
  ];

  const supervisorLinks = [
    { href: "/dashboard/tasks", label: "Gerenciar Tarefas" },
  ];

  const managerLinks = [
    { href: "/dashboard/reports", label: "Relatórios" },
  ];

  const employeeLinks = [
    { href: "/dashboard/orders", label: "Minhas Tarefas" },
  ];

  type LinkType = { href: string; label: string };
  let roleLinks: LinkType[] = [];

  if (user?.role === "gerente") roleLinks = managerLinks;
  else if (user?.role === "supervisor") roleLinks = supervisorLinks;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  else if (user?.role === "funcionario") roleLinks = employeeLinks;

  return (
    <nav className="border-b shadow px-4 py-2 flex justify-between items-center">
      <div className="text-lg font-semibold">
        <Link href="/dashboard">Dashboard</Link>
      </div>

      
    </nav>
  );
}
