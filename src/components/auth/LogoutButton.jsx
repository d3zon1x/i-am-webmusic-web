import api from "@/lib/axios"

export default function LogoutButton() {
    const handleLogout = async () => {
        try {
            await api.post("/logout")
            window.location.href = "/" // або navigate("/") якщо в роутері
        } catch (err) {
            console.error("Logout error:", err)
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="text-sm text-red-400 underline hover:text-red-300"
        >
            Logout
        </button>
    )
}
