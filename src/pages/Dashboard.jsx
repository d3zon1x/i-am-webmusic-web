import { useEffect, useState } from "react"
import api from "@/lib/axios"

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/me")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center p-4">Loading...</p>
    if (!user) return <p className="text-center p-4 text-red-500">Access denied</p>

    return (
        <div className="p-6 text-center">
            <h1 className="text-3xl font-bold">Welcome, {user.email} 🎧</h1>
        </div>
    )
}
