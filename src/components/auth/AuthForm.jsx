import { useState } from "react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"

export default function AuthForm({ type = "login" }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const isLogin = type === "login"

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const res = await api.post(`/${type}`, { email, password })
            console.log("✅ Success:", res.data)
            // TODO: зберегти токен, редірект, показати повідомлення тощо
        } catch (err) {
            console.error("❌ Error:", err)
            setError(err.response?.data?.detail || "Something went wrong")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-4">
            <h2 className="text-2xl font-bold text-center">
                {isLogin ? "Login" : "Register"}
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="email"
                placeholder="Email"
                className="w-full p-2 rounded bg-zinc-800 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded bg-zinc-800 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button className="w-full" type="submit">
                {isLogin ? "Login" : "Register"}
            </Button>
        </form>
    )
}
