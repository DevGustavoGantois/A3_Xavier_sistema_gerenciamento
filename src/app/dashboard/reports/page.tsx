import OnlyFor from "@/components/OnlyFor";

export default function ManagerDashboard() {
    return (
        <OnlyFor roleAllowed={["gerente"]}>
      <div>
        <h1>Relatórios</h1>
        <p>Conteúdo visual de relatórios.</p>
      </div>
    </OnlyFor>
    )
}