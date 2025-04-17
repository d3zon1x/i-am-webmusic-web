import { useState } from "react"
import api from "@/lib/axios"
import { useNavigate } from "react-router-dom"
import AuthPageWrapper from "@/pages/AuthPageWrapper.jsx"
import showIcon from "@/assets/show.png"
import hideIcon from "@/assets/hide.png"

export default function AuthForm() {
    const [mode, setMode] = useState("login")
    const [forgotMode, setForgotMode] = useState(false)
    const isLogin = mode === "login"
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        

        if (!isLogin && password !== repeatPassword) {
            setError("Passwords do not match")
            return
        }

        if (!isLogin) {
            const usernameError = validateUsername(username)
            if (usernameError) {
                setError(usernameError)
                return
            }
        }

        if (forgotMode) {
            if (cooldown > 0) return

            setIsSending(true)
            try {
                await api.post("/forgot-password", { email })
                setSuccess("Password reset email has been sent. Check your inbox (or spam folder).")
                setCooldown(60) // 60 секунд блокування
            } catch (err) {
                const msg = err.response?.data?.detail
                setError(typeof msg === "string" ? msg : "Something went wrong")
            } finally {
                setIsSending(false)
            }
            return
        }

        try {
            if (mode === "register") {
                await api.post("/register", {
                    email,
                    password,
                    username,
                })
            } else {
                await api.post("/login", {
                    email,
                    password,
                    remember_me: rememberMe,
                })
            }

            if (isLogin) {
                navigate("/dashboard")
            } else {
                setSuccess("Account created successfully but not active yet. Check your email for activation.")
                setMode("login")
                setEmail("")
                setPassword("")
                setRepeatPassword("")
            }
        } catch (err) {
            const msg = err.response?.data?.detail
            setError(typeof msg === "string" ? msg : "Something went wrong")
        }
    }

    const validateUsername = (username) => {
        const minLength = 3
        const regex = /^[a-zA-Z0-9_]+$/

        if (username.length < minLength) return "Username must be at least 3 characters"
        if (!regex.test(username)) return "Username can only contain letters, numbers, and underscores"
        return null
    }

    return (
        <AuthPageWrapper>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/10 animate-fade-in"
            >
                {/* Tabs */}
                {!forgotMode && (
                    <div className="flex justify-center mb-6">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sl font-semibold tracking-wide uppercase ${
                                isLogin ? "text-white border-b-2 border-white" : "text-white/50"
                            } transition`}
                            onClick={() => {
                                setMode("login")
                                setEmail("")
                                setPassword("")
                                setRepeatPassword("")
                                setError("")
                                setForgotMode(false)
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sl font-semibold tracking-wide uppercase ${
                                !isLogin ? "text-white border-b-2 border-white" : "text-white/50"
                            } transition`}
                            onClick={() => {
                                setMode("register")
                                setEmail("")
                                setPassword("")
                                setRepeatPassword("")
                                setError("")
                                setSuccess("")
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                )}

                {error && (
                    <p className="bg-gradient-to-r from-[rgba(61,21,17,0.3)] to-[rgba(135,41,31,0.3)] text-white px-4 py-2 rounded-md text-sm text-center mb-4 font-medium">
                        {error}
                    </p>
                )}
                {success && <p className="text-green-400 mb-4 text-center">{success}</p>}

                {!forgotMode && !isLogin && (
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full bg-transparent border border-white/20 p-3 rounded-md mb-4 placeholder-white/60 focus:outline-none focus:border-red-500 transition"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}
                
                {forgotMode && (
                <h2 className="text-white text-xl font-semibold mb-6 text-center">
                    RESET PASSWORD
                </h2>
                    )}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent border border-white/20 p-3 rounded-md mb-4 placeholder-white/60 focus:outline-none focus:border-red-500 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {!forgotMode && (
                    <>
                        <div className="relative mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full bg-transparent border border-white/20 p-3 rounded-md placeholder-white/60 focus:outline-none focus:border-red-500 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm"
                            >
                                <img src={showPassword ? hideIcon : showIcon} alt="toggle"
                                     className="w-5 h-5 opacity-80 hover:opacity-100"/>
                            </button>
                        </div>

                        {!isLogin && (
                            <div className="relative mb-6">
                                <input
                                    type={showRepeatPassword ? "text" : "password"}
                                    placeholder="Repeat your password"
                                    className="w-full bg-transparent border border-white/20 p-3 rounded-md placeholder-white/60 focus:outline-none focus:border-red-500 transition"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm"
                                >
                                    <img src={showRepeatPassword ? hideIcon : showIcon} alt="toggle"
                                         className="w-5 h-5 opacity-80 hover:opacity-100"/>
                                </button>
                            </div>
                        )}
                    </>
                )}

                {isLogin && !forgotMode && (
                    <div className="flex items-center justify-between mb-6 text-sm">
                        <label className="flex items-center gap-2 text-white/70">
                            <input
                                type="checkbox"
                                className="appearance-none w-4 h-4 border border-white/50 rounded-sm bg-transparent checked:bg-red-800 checked:appearance-auto accent-red-700 transition duration-150"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                        <button
                            type="button"
                            className="text-white/60 hover:text-white transition underline"
                            onClick={() => {
                                setForgotMode(true)
                                setMode("login")
                                setError("")
                                setSuccess("")
                                setEmail("")
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={forgotMode && isSending}
                    className={`w-full bg-gradient-to-r from-[#3d1511] to-[#87291f] text-white font-medium py-3 rounded-md transition ${
                        forgotMode && isSending ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
                    }`}
                >
                    {forgotMode
                        ? isSending ? "Sending..." : "Send reset link"
                        : isLogin
                            ? "Sign In"
                            : "Register"}
                </button>

                {forgotMode && (

                    <div className="text-center mt-4">

                        <button
                            type="button"
                            className="text-white/50 hover:text-white underline text-sm"
                            onClick={() => {
                                setForgotMode(false)
                                setError("")
                                setSuccess("")
                            }}
                        >
                            Back to Sign In
                        </button>
                    </div>
                )}
            </form>
        </AuthPageWrapper>
    )
}
