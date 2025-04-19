import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/axios"

export default function RedirectIfAuthenticated({ children }) {
    const [checking, setChecking] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        api.get("/me")
            .then(() => navigate("/dashboard"))
            .catch(() => {}) // якщо неавторизований — нічого не робимо
            .finally(() => setChecking(false))
    }, [])

    if (checking) return null
    return children
}
