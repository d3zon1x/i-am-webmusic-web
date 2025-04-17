import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import api from "@/lib/axios"
import AuthPageWrapper from "@/pages/AuthPageWrapper.jsx"
import showIcon from "@/assets/show.png"
import hideIcon from "@/assets/hide.png"

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    const handleReset = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!password || !repeatPassword) {
            setError("Please fill in both fields")
            return
        }

        if (password !== repeatPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            await api.post("/reset-password", {
                token,
                new_password: password,
            })
            setSuccess("Password was successfully reset! Redirecting to login...")
            setTimeout(() => navigate("/*"), 3000)
        } catch (err) {
            const msg = err.response?.data?.detail
            setError(typeof msg === "string" ? msg : "Something went wrong")
        }
    }

    return (
        <AuthPageWrapper>
            <form
                onSubmit={handleReset}
                className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/10 animate-fade-in"
            >
                <h2 className="text-white text-xl font-semibold mb-6 text-center">
                    RESET PASSWORD
                </h2>

                {error && (
                    <p className="bg-gradient-to-r from-red-800/40 to-red-500/40 text-white px-4 py-2 rounded-md text-sm text-center mb-4 font-medium">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-400 mb-4 text-center text-sm">{success}</p>
                )}

                {/* Password input with toggle */}
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        className="w-full bg-transparent border border-white/20 p-3 rounded-md placeholder-white/60 focus:outline-none focus:border-red-500 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        <img src={showPassword ? hideIcon : showIcon} alt="toggle" className="w-5 h-5 opacity-80 hover:opacity-100" />
                    </button>
                </div>

                {/* Repeat password with toggle */}
                <div className="relative mb-6">
                    <input
                        type={showRepeatPassword ? "text" : "password"}
                        placeholder="Repeat new password"
                        className="w-full bg-transparent border border-white/20 p-3 rounded-md placeholder-white/60 focus:outline-none focus:border-red-500 transition"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        <img src={showRepeatPassword ? hideIcon : showIcon} alt="toggle" className="w-5 h-5 opacity-80 hover:opacity-100" />
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#3d1511] to-[#87291f] text-white font-medium py-3 rounded-md transition hover:opacity-90"
                >
                    Reset password
                </button>
            </form>
        </AuthPageWrapper>    )
}
