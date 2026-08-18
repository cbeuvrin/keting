import { loadPrototipoCopy } from "@/lib/crm-settings";
import { PlantillaEditor } from "./PlantillaEditor";

export const dynamic = "force-dynamic";

export default async function PlantillaPage() {
    const copy = await loadPrototipoCopy();
    return <PlantillaEditor initial={copy} />;
}
