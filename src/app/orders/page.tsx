import { Navbar } from "@/components/c-navbar";

export default function Page() {

    if (role === "funcionário") return <FuncionarioDashboard />
    if (role === "supervisor") return <SupervisorDashboard />
    if (role === "gerente") return <GerenteDashboard />

    return (
        <>
        <Navbar />
        </>
    )
}