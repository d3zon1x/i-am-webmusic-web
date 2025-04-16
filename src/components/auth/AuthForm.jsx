import { useState } from "react"
import api from "@/lib/axios"
import { useNavigate } from "react-router-dom"
import AuthPageWrapper from "@/pages/AuthPageWrapper.jsx"
import showIcon from "@/assets/show.png"
import hideIcon from "@/assets/hide.png"

export default function AuthForm() {
    const [mode, setMode] = useState("login")
    const isLogin = mode === "login"
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
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

        try {
            if (mode === "register") {
                await api.post("/register", {
                    email,
                    password,
                    username,
                })
            }else{
                await api.post(`/${mode}`, {
                    email,
                    password,
                    remember_me: rememberMe,
                })
            }
              

            if (isLogin) {
                navigate("/dashboard")
            } else {
                setSuccess("Account created successfully. You can now sign in!")
                // optionally switch to login:
                setMode("login")
                setEmail("")
                setPassword("")
                setRepeatPassword("")
            }
        } catch (err) {
            const msg = err.response?.data?.detail;
            setError(typeof msg === "string" ? msg : "Something went wrong");
        }
    }

    const validateUsername = (username) => {
        const minLength = 3
        const regex = /^[a-zA-Z0-9_]+$/

        if (username.length < minLength) {
            return "Username must be at least 3 characters long"
        }

        if (!regex.test(username)) {
            return "Username can only contain letters, numbers, and underscores"
        }

        return null
    }
    
    return (
        <AuthPageWrapper>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/10 animate-fade-in"
            >
                {/* Tabs */}
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

                {error && (
                    <p className="bg-gradient-to-r from-[rgba(61,21,17,0.3)] to-[rgba(135,41,31,0.3)] text-white px-4 py-2 rounded-md text-sm text-center mb-4 font-medium">
                        {error}
                    </p>
                )} {success && <p className="text-green-400 mb-4 text-center">{success}</p>}

                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full bg-transparent border border-white/20 p-3 rounded-md mb-4 placeholder-white/60 focus:outline-none focus:border-red-500 transition"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}


                <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent border border-white/20 p-3 rounded-md mb-4 placeholder-white/60 focus:outline-none focus:border-red-500 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* Password input with eye */}
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
                        {/*{showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}*/}

                        <img src={showPassword ? hideIcon : showIcon} alt="toggle"
                             className="w-5 h-5 opacity-80 hover:opacity-100"/>

                    </button>
                </div>

                {/* Repeat password only for register */}
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
                            {/*{showRepeatPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}*/}

                            <img src={showRepeatPassword ? hideIcon : showIcon} alt="toggle"
                                 className="w-5 h-5 opacity-80 hover:opacity-100"/>

                        </button>
                    </div>
                )}

                {isLogin && (
                    
                <div className="flex items-center justify-between mb-6 text-sm">
                    <label className="flex items-center gap-2 text-white/70">
                        <input
                            type="checkbox"
                            className=" appearance-none w-4 h-4 border border-white/50 rounded-sm bg-transparent checked:bg-red-800 checked:appearance-auto accent-red-700 transition duration-150"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember me
                    </label>
                    <button
                        type="button"
                        className="text-white/60 hover:text-white transition underline"
                        disabled
                    >
                        Forgot password?
                    </button>
                </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#3d1511] to-[#87291f] text-white font-medium py-3 rounded-md transition hover:opacity-90"
                >
                    {isLogin ? "Sign In" : "Register"}
                </button>
            </form>
        </AuthPageWrapper>
    )
}
