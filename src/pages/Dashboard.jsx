import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import MainPageWrapper from "@/pages/MainPageWrapper.jsx";
import { Clock } from "lucide-react";
import { FaPlay, FaPause, FaSearch } from "react-icons/fa";
import CustomAudioPlayer from "@/components/player/CustomAudioPlayer.jsx";
import dummy from "../assets/nav_logo.png"

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredTrack, setHoveredTrack] = useState(null);
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);


    useEffect(() => {
        api.get("/me")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = async () => {
        if (!searchTerm) return;
        setSearching(true);
        setHasSearched(true);
        setResults([]);
        try {
            const res = await api.get(`/music/search?query=${encodeURIComponent(searchTerm)}`);
            setResults(res.data);
            // console.log(res);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handlePlay = (track) => {
        const url = `http://localhost:8000/api/music/stream/${track.videoId}`;
        setCurrentTrackUrl(url);

        // Отримуємо прев'юшку з треку (якщо вона є)
        const trackThumbnail = getHighResThumbnail(track)

        // Створюємо об'єкт з усіма потрібними даними
        const trackDetails = {
            url,
            title: track.title, // Назва пісні
            artist: track.artists?.map(a => a.name).join(", "), // Виконавець
            thumbnail: trackThumbnail, // Прев'юшка
        };

        // Зберігаємо дані в стані
        setCurrentTrack(trackDetails);
    };

    const getHighResThumbnail = (track) => {
        const lastThumb = track.thumbnails?.[track.thumbnails.length - 1]?.url;
        // console.log(lastThumb);
        return lastThumb?.replace(/w\d+-h\d+/, 'w500-h500');
    };

    if (loading) return <p className="text-center p-4">Loading...</p>;
    if (!user) return <p className="text-center p-4 text-red-500">Access denied</p>;

    return (
        <MainPageWrapper>
            <div className="p-6 mt-6 text-center max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">I AM WEB MUSIC</h1>

                <div className="flex justify-center mb-10">
                    <div className="relative w-2/3">
                        <button onClick={handleSearch} className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                            <FaSearch className="text-white/70 w-4 h-4" />
                        </button>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Search for a song or artist"
                            className="w-full bg-white/10 backdrop-blur px-10 py-3 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent shadow-md text-sm"
                        />
                    </div>
                </div>

                {searching ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                            <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {hasSearched && results.length === 0 && (
                            <div className="flex justify-center mb-10">
                                <p className="bg-gradient-to-r from-[rgba(61,21,17,0.3)] to-[rgba(135,41,31,0.3)] text-white px-4 py-2 rounded-md text-sm text-center font-medium">
                                    No results found for "<span className="font-semibold">{searchTerm}</span>"
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                            {results.slice(0, 3).map((track, idx) => (
                                <div
                                    key={idx}
                                    onMouseEnter={() => setHoveredCard(idx)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className="relative bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md text-left transition-all"
                                >
                                    <div className="w-full aspect-square overflow-hidden rounded mb-3 relative">
                                        <img
                                            src={getHighResThumbnail(track)}
                                            alt={track.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = dummy }}
                                        />
                                        <div className="absolute bottom-2 right-2 transition-opacity duration-300 ${hoveredCard === idx ? 'opacity-100' : 'opacity-0">
                                            <button onClick={() => handlePlay(track)} className="bg-gradient-to-r from-[#3d1511] to-[#87291f] p-4 rounded-full shadow-xl transform transition-transform duration-300 hover:scale-110">
                                                <FaPlay className="text-white w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-base mb-1 text-left truncate">{track.title}</h3>
                                    <p className="text-sm text-white/70 text-left truncate">{track.artists?.map(a => a.name).join(", ")}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {results.slice(3).map((track, idx) => (
                                <div
                                    key={idx}
                                    onMouseEnter={() => setHoveredTrack(idx)}
                                    onMouseLeave={() => setHoveredTrack(null)}
                                    className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg flex items-center justify-between shadow-md hover:bg-white/20 transition group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={getHighResThumbnail(track)}
                                                alt={track.title}
                                                className="w-12 h-12 rounded object-cover group-hover:brightness-50"
                                                onError={(e) => { e.target.src = dummy }}
                                            />
                                            {hoveredTrack === idx && (
                                                <button onClick={() => handlePlay(track)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full shadow-lg transition-opacity duration-200">
                                                    <FaPlay className="w-3 h-3 text-white" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-sm truncate">{track.title}</p>
                                            <p className="text-xs text-white/70 truncate">
                                                {track.artists?.map(a => a.name).join(", ")} • {track.views?.toString()} plays
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-white/60 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {track.duration}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Custom Audio Player */}
                    </>
                )}
                {currentTrack && <CustomAudioPlayer track={currentTrack} />}
            </div>
        </MainPageWrapper>
    );
}