import {useState, useEffect} from "react";
import api from "@/lib/axios";
import MainPageWrapper from "@/pages/MainPageWrapper.jsx";
import 'swiper/css';
import "./artist-page.css"
import AlbumCarousel from "@/components/artist/AlbumCarousel.jsx";
import {FaPlay} from "react-icons/fa";
import { Clock } from "lucide-react";
import dummy from "../../assets/nav_logo.png"


export default function ArtistPage() {
    const [artistData, setArtistData] = useState(null);
    const artistName = window.location.pathname.split('/')[2];
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [albumTracks, setAlbumTracks] = useState([]);
    const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0);
    const [hoveredTrack, setHoveredTrack] = useState(null);
    
    useEffect(() => {
        const fetchArtistData = async () => {
            console.log(`Artist: ${artistName}`);
            const res = await api.get(`/artist/${artistName}`);
            console.log("FetchData", res.data);
            setArtistData(res.data);
            console.log("SelectedAlbum", res.data.albums[0].name);
            setSelectedAlbum(res.data.albums[0]); 
        };

        fetchArtistData();
    }, [artistName]);


    useEffect(() => {
        if (!selectedAlbum) return console.log("No selectedAlbum");

        async function fetchTracks() {
            console.log(`Album: ${selectedAlbum}`);
            const res = await api.get(`/album/${selectedAlbum.id}/tracks`);
            console.log("Album 52", res.data);
            setAlbumTracks(res.data.tracks);
        }
        
        if (selectedAlbum) {
            console.log("Album before fetching", selectedAlbum);
            fetchTracks();
        }
    }, [selectedAlbum]); 



    if (!artistData) return <p>Loading...</p>;
    if (!selectedAlbum && artistData.albums && artistData.albums.length > 0) {
        setSelectedAlbum(artistData.albums[0]);
    }

    return (
        <MainPageWrapper>
            <div className="artist-page">
                {/* Ліва колонка */}
                <div className="left-column">
                    <div
                        className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden mb-8 shadow"
                        style={{
                            backgroundImage: `url(${artistData.artist.photo})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"/>

                        {/* Ім’я артиста */}
                        <div className="absolute bottom-4 right-6 md:right-12">
                            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                                {artistData.artist.name}
                            </h1>
                        </div>
                    </div>

                    <div className="popular-tracks bg-black p-5 rounded-lg">
                        <h2 className="section-title">POPULAR TRACKS</h2>
                        <div className="track-list scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            {artistData.topTracks.map((track, idx) => (
                                <div
                                    key={idx}
                                    onMouseEnter={() => setHoveredTrack(idx)}
                                    onMouseLeave={() => setHoveredTrack(null)}
                                    className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg flex items-center justify-between shadow-md hover:bg-white/20 transition group cursor-pointer"
                                    onClick={() => {
                                        setQueue(artistData.topTracks);
                                        playTrack(track, idx);
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={track.thumbnail || dummy}
                                                alt={track.title}
                                                className="w-12 h-12 rounded object-cover group-hover:brightness-50"
                                                onError={(e) => {
                                                    e.target.src = dummy;
                                                }}
                                            />
                                            {hoveredTrack === idx && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        playTrack(track, idx);
                                                    }}
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full shadow-lg transition-opacity duration-200"
                                                >
                                                    <FaPlay className="w-3 h-3 text-white"/>
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-sm truncate">{track.title}</p>
                                            <p className="text-xs text-white/70 truncate">
                                                {track.artist}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-sm text-white/60 flex items-center gap-1">
                                        <Clock className="w-4 h-4"/>
                                        {new Date(track.duration_ms).toISOString().substr(14, 5)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Права колонка */}
                <div className="right-column bg-black p-5 rounded-lg">
                    <h2 className="section-title">ALBUMS & SINGLES</h2>

                    {/* Карусель */}

                    <AlbumCarousel
                        albums={artistData.albums}
                        selectedAlbum={selectedAlbum}
                        onSelect={(album, i) => {
                            setSelectedAlbum(album);
                            setSelectedAlbumIndex(i);
                        }}
                    />


                    {/* Треки вибраного альбому */}
                    {selectedAlbum && (
                        <div className="album-tracks">
                            <h3 className="album-name">{selectedAlbum.name}</h3>
                            <div className="album-track-list">
                                {albumTracks.map((track, idx) => (
                                    <div
                                        key={idx}
                                        onMouseEnter={() => setHoveredTrack(idx)}
                                        onMouseLeave={() => setHoveredTrack(null)}
                                        className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg flex items-center justify-between shadow-md hover:bg-white/20 transition group cursor-pointer"
                                        onClick={() => {
                                            setQueue(albumTracks);
                                            playTrack({ ...track, artist: artistData.artist.name }, idx);
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={selectedAlbum.photo || dummy}
                                                    alt={track.title}
                                                    className="w-12 h-12 rounded object-cover group-hover:brightness-50"
                                                    onError={(e) => {
                                                        e.target.src = dummy;
                                                    }}
                                                />
                                                {hoveredTrack === idx && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            playTrack({ ...track, artist: artistData.artist.name }, idx);
                                                        }}
                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full shadow-lg transition-opacity duration-200"
                                                    >
                                                        <FaPlay className="w-3 h-3 text-white" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-sm truncate">{track.title}</p>
                                                <p className="text-xs text-white/70 truncate">
                                                    {artistData.artist.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-sm text-white/60 flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {new Date(track.duration_ms).toISOString().substr(14, 5)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </MainPageWrapper>
    );
}