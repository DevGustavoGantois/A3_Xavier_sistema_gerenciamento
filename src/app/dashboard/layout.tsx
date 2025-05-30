export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex">
            <aside>

            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}