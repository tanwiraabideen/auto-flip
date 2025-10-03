'use client'

import { redirect, useRouter } from "next/navigation";
import { signOut } from "../../../lib/actions/auth-actions";


export default function Navbar({ session }) {
    const router = useRouter()


    const handleSignOut = async () => {
        await signOut()
        router.push('/')
    }

    return (
        <div className="flex flex-row">
            {session ? <div>
                <button className="btn btn-neutral btn-outline" onClick={() => redirect('/setFilters')}>Set Filters</button>
                <button className="btn btn-neutral btn-outline" onClick={handleSignOut}>Sign Out</button>
            </div>
                : <button className="btn btn-neutral btn-outline" onClick={() => redirect(redirect('/auth'))}>Sign Up</button>
            }
        </div>
    )
}