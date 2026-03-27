import DashboardBody from "@/components/dashboard/dashboard-body";
import DashboardHeader from "@/components/dashboard/header";
import ProtectRoute from "@/components/guards/protectRoute";


export default function DashboardPage() {
    return <>
        <ProtectRoute>
            <main>
                <DashboardHeader />
                <DashboardBody />
            </main>
        </ProtectRoute>
    </>
}