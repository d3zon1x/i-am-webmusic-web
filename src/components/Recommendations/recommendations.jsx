// src/components/Recommendations.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import dummy from "@/assets/nav_logo.png";

export default function Recommendations() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // тут можна отримати country із user_info або взяти з браузера:
                const country = "PL"; // наприклад, з user_info
                const res = await axios.get(`/api/spotify/top-tracks?country=${country}`);
                setTracks(res.data.tracks);
            } catch (err) {
                console.error("Failed to fetch recommendations:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading || tracks.length === 0) return null;

    return (
        <div className="recommendations-section mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">Top Tracks in Your Country</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {tracks.map((t, i) => (
                    <div key={i} className="relative bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md hover:scale-[1.03] transition-transform">
                        <div className="aspect-square mb-2 overflow-hidden rounded">
                            <img
                                src={t.thumbnail || dummy}
                                alt={t.title}
                                className="w-full h-full object-cover"
                                onError={e => (e.currentTarget.src = dummy)}
                            />
                        </div>
                        <p className="text-sm font-medium truncate">{t.title}</p>
                        <p className="text-xs text-white/70 truncate">{t.artist}</p>
                        <button className="absolute top-2 right-2 p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                            <FaPlay className="w-4 h-4 text-white"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
