import bgImage from "@/assets/auth_bg_r.jpg"
import logo from "@/assets/nav_logo.png"
import { useEffect, useState } from "react"
import LogoutButton from "@/components/auth/LogoutButton.jsx"
import api from "@/lib/axios.js"
import dummy from "@/assets/nav_logo.png";
import {FaPlay} from "react-icons/fa";
import {Clock} from "lucide-react";
import CustomAudioPlayer from "@/components/player/CustomAudioPlayer.jsx";
import {useMusic} from "@/contexts/MusicContext.jsx";
import {useNavigate} from "react-router-dom";

export default function MainPageWrapper({ children }) {
    const [user, setUser] = useState(null)
    const { currentTrack } = useMusic();
    const navigate = useNavigate();


    useEffect(() => {
        api.get("/me")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
    }, [])
    
    

    return (
        <div
            className="w-screen h-screen bg-cover bg-center"
            style={{backgroundImage: `url(${bgImage})`}}
        >
            {/* NAVBAR */}
            <header
                className="w-full relative bg-black bg-opacity-95 text-white px-8 py-4 flex justify-between items-center">
                {/* LEFT: empty spacer */}
                <div className="w-[150px]"/>

                {/* CENTER: nav with logo */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6 text-sm font-semibold">
                    <button className="hover:text-red-500 transition">Home</button>
                    <button className="hover:text-red-500 transition">For you</button>
                    <button onClick={() => navigate(`/dashboard`)}>
                        <img src={logo} alt="Logo" className="h-8 object-contain mx-2"/>
                    </button>
                    <button className="hover:text-red-500 transition">Ranking</button>
                    <button className="hover:text-red-500 transition">Profile</button>
                </div>

                {/* RIGHT: Profile + name + logout */}
                <div className="flex items-center gap-3 z-10">
                    <div className="w-8 h-8 bg-white rounded-full border border-gray-300"/>
                    <span className="text-white/80 font-medium text-sm">{user?.username}</span>
                    <LogoutButton/>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="h-[calc(100vh-72px)] overflow-y-auto  scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/*<main className="h-[calc(100vh-72px)] overflow-y-auto pb-40 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">*/}
                <div >

                    {children}
                    {/*{currentTrack && (*/}
                    {/*    <CustomAudioPlayer/>*/}
                    {/*)}*/}
                </div>
            </main>
        </div>
)
}
