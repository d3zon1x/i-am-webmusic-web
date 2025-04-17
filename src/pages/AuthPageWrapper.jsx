import bgImage from "@/assets/auth_bg_r.jpg"
import logo from "@/assets/auth_logo1.png"

export default function AuthPageWrapper({ children }) {
    return (
        <div
            className="w-screen h-screen bg-cover bg-center flex flex-col lg:flex-row"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Mobile logo on top */}
            <div className="block lg:hidden flex items-center justify-center pt-10">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-40 h-auto object-contain drop-shadow-xl"
                />
            </div>

            {/* Form container */}
            <div className="flex-1 flex items-center justify-center px-6 lg:px-28">
                {children}
            </div>

            {/* Desktop logo on the right */}
            <div className="hidden lg:flex w-1/2 items-center justify-center p-10 pr-56">
                <img
                    src={logo}
                    alt="Logo"
                    className="max-w-full max-h-[70%] object-contain drop-shadow-xl"
                />
            </div>
        </div>
    )
}
