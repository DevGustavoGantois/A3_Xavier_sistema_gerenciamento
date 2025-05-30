import { Navbar } from "@/components/c-navbar";
import { useEffect, useState } from "react";
import { EmployeeDashboard } from "./employees/page";
import ManagerDashboard from "./reports/page";

export default function Page() {

    const [role, setRole] = useState("");

    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        if (userRole) {
            setRole(userRole);
        }
    }, [])

    return (
        <>
        <Navbar />
        {role === "funcionário" && <EmployeeDashboard />}
      {role === "gerente" && <ManagerDashboard />}
      {!role && (
        <p className="text-center p-4 text-gray-500">Carregando informações do usuário...</p>
      )}
        </>
    )
}