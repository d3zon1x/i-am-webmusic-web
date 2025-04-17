import api from "@/lib/axios"
import { LogOut } from "lucide-react"  // іконка logout

export default function LogoutButton() {
    const handleLogout = async () => {
        try {
            await api.post("/logout")
            window.location.href = "/"
        } catch (err) {
            console.error("Logout error:", err)
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="hover:text-red-500 transition p-2"
            title="Logout"
        >
            <LogOut className="w-5 h-5" />
        </button>
    )
}
