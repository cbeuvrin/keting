"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type SheetChange = { path: string; before: Record<string, unknown>; after: Record<string, unknown>; label: string };

/** Serializa las correcciones y conserva los valores anteriores para deshacer. */
export function useSheet() {
    const router = useRouter();
    const queue = useRef<Promise<unknown>>(Promise.resolve());
    const [overrides, setOverrides] = useState<Record<string, Record<string, unknown>>>({});
    const [pending, setPending] = useState(0);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState<SheetChange[][]>([]);

    const save = (changes: SheetChange[], remember = true): Promise<boolean> => {
        if (!changes.length) return Promise.resolve(true);
        setPending((n) => n + 1);
        const work = queue.current.then(async () => {
            setError("");
            const completed: SheetChange[] = [];
            try {
                for (const change of changes) {
                    const response = await fetch(`/api/admin/clientes/${change.path}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(change.after) });
                    if (!response.ok) {
                        const body = await response.json().catch(() => ({}));
                        throw new Error(body.error ?? `No se pudo guardar ${change.label}.`);
                    }
                    completed.push(change);
                    setOverrides((old) => ({ ...old, [change.path]: { ...old[change.path], ...change.after } }));
                }
                setMessage(remember ? (completed.length === 1 ? `${completed[0].label} guardado` : `${completed.length} cambios guardados`) : "Cambio deshecho");
                return true;
            } catch (err) {
                const detail = err instanceof Error ? err.message : "No se pudo guardar.";
                setError(`${detail}${completed.length ? ` Se guardaron ${completed.length} cambios anteriores; puedes deshacerlos.` : " Revisa el dato e inténtalo de nuevo."}`);
                return false;
            } finally {
                if (remember && completed.length) setHistory((old) => [...old.slice(-29), completed]);
                setPending((n) => n - 1);
                router.refresh();
            }
        });
        queue.current = work.catch(() => undefined);
        return work;
    };

    const undo = async () => {
        if (pending || !history.length) return;
        const last = history[history.length - 1];
        const reverse = [...last].reverse().map((change) => ({ ...change, before: change.after, after: change.before }));
        // Quitamos solo las operaciones que sí se deshicieron si el servidor falla a mitad.
        let undone = 0;
        for (const change of reverse) {
            if (!(await save([change], false))) break;
            undone++;
        }
        if (undone) setHistory((old) => {
            const rest = last.slice(0, last.length - undone);
            return [...old.slice(0, -1), ...(rest.length ? [rest] : [])];
        });
    };

    return { overrides, pending, error, message, save, undo, canUndo: history.length > 0 && !pending, setError, setMessage };
}
export type Sheet = ReturnType<typeof useSheet>;
