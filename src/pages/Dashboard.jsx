import { useEffect, useState } from "react"
import api from "@/lib/axios"
import LogoutButton from "@/components/auth/LogoutButton.jsx";
import MainPageWrapper from "@/pages/MainPageWrapper.jsx";

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
        <MainPageWrapper>
            <div className="p-6 mt-6 text-center">
            <h1 className="text-3xl font-bold">XY3SOS1</h1>
            
        </div>
        </MainPageWrapper>
    )
}
