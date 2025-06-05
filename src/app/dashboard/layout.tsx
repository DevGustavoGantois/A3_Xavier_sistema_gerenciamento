import { Navbar } from "@/components/c-navbar";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-col gap-4 p-6">
            <div>
             <Navbar />
            </div>
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}