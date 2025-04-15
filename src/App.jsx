import AuthForm from "@/components/auth/AuthForm"

export default function App() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
            <AuthForm type="login" />
        </div>
    )
}
