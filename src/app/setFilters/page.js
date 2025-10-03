import { redirect } from "next/navigation";
import Filters from "../components/Filters";
import { headers } from "next/headers";
import { auth } from "../../../lib/auth";

export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/auth")
    }
    return (
        <div id="main-container" className="w-full h-full">
            <div id="filters-wrapper" className="flex items-center justify-center">
                <Filters></Filters>
            </div>
        </div>
    )
}