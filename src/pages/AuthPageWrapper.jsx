import bgImage from "@/assets/auth_bg_r.jpg"
import logo from "@/assets/auth_logo1.png"

export default function AuthPageWrapper({ children }) {
    return (
        <div
            className="w-screen h-screen bg-cover bg-center flex"
            style={{backgroundImage: `url(${bgImage})`}}
        >
            {/* Ліва частина — логін форма */}
            <div className="w-1/2 flex items-center justify-center backdrop-blur-sm pl-28">
                {children}
            </div>

            {/* Права частина — лого або ілюстрація */}
            <div className="w-1/2 flex items-center justify-center p-10 pr-56">
                <img src={logo} alt="Logo" className="max-w-full max-h-[70%] object-contain drop-shadow-xl "/>
            </div>

            
        </div>
    )
}
