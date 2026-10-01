"use client";
import type { ClientesData } from "@/lib/clientes-rows";
import { FinancialBoard } from "./sheet/FinancialBoard";
export function Resumen({ data }: { data: ClientesData }) {
    return <FinancialBoard data={data} />;
}
