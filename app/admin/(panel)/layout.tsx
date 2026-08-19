import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-auth";
import { Sidebar } from "./Sidebar";

// Guard del panel: todo lo que cuelga de este grupo exige la cookie válida.
// El login vive FUERA del grupo, así que nunca entra en bucle de redirección.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    if (!(await isAdminRequest())) redirect("/admin/login");

    return (
        <div className="min-h-screen md:flex bg-[#F7F7F4]">
            <Sidebar />
            {/* md:ml-[220px] no: el flex ya reserva el ancho. En móvil la barra
                es horizontal arriba y el contenido fluye debajo. */}
            <div className="flex-1 min-w-0">{children}</div>
        </div>
    );
}
