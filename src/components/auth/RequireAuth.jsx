import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/axios"

export default function RequireAuth({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        api.get("/me")
            .then(() => setIsAuthorized(true))
            .catch(() => {
                setIsAuthorized(false)
                navigate("/")
            })
    }, [navigate])

    if (isAuthorized === null) {
        return <div className="text-center p-4">Loading...</div>
    }

    return children
}
