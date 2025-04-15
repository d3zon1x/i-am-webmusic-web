import api from "@/lib/axios"

export default function LogoutButton() {
    const handleLogout = async () => {
        await api.post("/auth/logout")
        window.location.href = "/"
    }

    return (
        <button onClick={handleLogout} className="text-sm text-red-400 underline">
            Logout
        </button>
    )
}
