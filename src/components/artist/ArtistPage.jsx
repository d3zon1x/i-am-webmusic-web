import {useState, useEffect, useRef} from "react";
import api from "@/lib/axios";
import CustomAudioPlayer from "@/components/player/CustomAudioPlayer.jsx";
import MainPageWrapper from "@/pages/MainPageWrapper.jsx";
import "./artist-page.css"

export default function ArtistPage() {
    const [artistData, setArtistData] = useState(null);
    const artistName = window.location.pathname.split('/')[2]; // Отримуємо ім'я артиста з URL
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [albumTracks, setAlbumTracks] = useState([]);
    const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0); // Ставимо початковий індекс

    const albumGalleryRef = useRef(null);
    
    // Завантажуємо дані артиста
    useEffect(() => {
        const fetchArtistData = async () => {
            console.log(`Artist: ${artistName}`);
            const res = await api.get(`/artist/${artistName}`);
            console.log("FetchData", res.data);
            setArtistData(res.data);
            console.log("SelectedAlbum", res.data.albums[0].name);
            setSelectedAlbum(res.data.albums[0]); // Встановлюємо перший альбом по дефолту
        };

        fetchArtistData();
    }, [artistName]);

    // Завантажуємо треки альбому
    useEffect(() => {
        if (!selectedAlbum) return console.log("No selectedAlbum");

        async function fetchTracks() {
            console.log(`Album: ${selectedAlbum}`);
            const res = await api.get(`/album/${selectedAlbum.id}/tracks`);
            console.log("Album 52", res.data);
            setAlbumTracks(res.data.tracks);
        }

        // Викликаємо fetchTracks, коли selectedAlbum оновлено
        if (selectedAlbum) {
            console.log("Album before fetching", selectedAlbum);
            fetchTracks();
        }
    }, [selectedAlbum]); // Залежність від selectedAlbum гарантує, що fetchTracks викликається тільки після оновлення цього стану

    // Функція для попереднього альбому
    const handlePrev = () => {
        const prevIndex = (selectedAlbumIndex - 1 + artistData.albums.length) % artistData.albums.length;
        setSelectedAlbum(artistData.albums[prevIndex]);
        setSelectedAlbumIndex(prevIndex);
    };

    // Функція для наступного альбому
    const handleNext = () => {
        const nextIndex = (selectedAlbumIndex + 1) % artistData.albums.length;
        setSelectedAlbum(artistData.albums[nextIndex]);
        setSelectedAlbumIndex(nextIndex);
    };

    const scrollToSelectedAlbum = () => {
        const selectedAlbumElement = albumGalleryRef.current.children[selectedAlbumIndex];
        selectedAlbumElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    };

    useEffect(() => {
        if (selectedAlbum) {
            scrollToSelectedAlbum();
        }
    }, [selectedAlbumIndex]);




    if (!artistData) return <p>Loading...</p>;
    if (!selectedAlbum && artistData.albums && artistData.albums.length > 0) {
        setSelectedAlbum(artistData.albums[0]);
    }

    return (
        <MainPageWrapper>
            <div className="artist-page">
                {/* Ліва колонка */}
                <div className="left-column">
                    <div className="artist-header">
                        <img src={artistData.artist.photo} alt={artistData.artist.name} className="artist-photo"/>
                        <h1 className="artist-name">{artistData.artist.name}</h1>
                    </div>

                    <div className="popular-tracks">
                        <h2>Popular Tracks</h2>
                        <div className="track-list">
                            {artistData.topTracks.map((t, i) => (
                                <div key={i} className="track-item" onClick={() => setCurrentTrack(t)}>
                                    <img src={t.thumbnail} className="track-thumbnail" alt={t.title}/>
                                    <div className="track-info">
                                        <p className="track-title">{t.title}</p>
                                        <p className="track-artist">{t.artist}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Права колонка */}
                <div className="right-column">
                    <div className="p-8">
                        <h2 className="text-2xl font-semibold mb-4">Albums & Singles</h2>

                        {/* Карусель альбомів */}
                        <div className="carousel-container relative">
                            <button className="carousel-button left" onClick={handlePrev}>
                                &#60;
                            </button>

                            <div className="album-gallery" ref={albumGalleryRef}>
                                {artistData.albums.map((album, i) => (
                                    <div
                                        key={i}
                                        className={`album-item ${selectedAlbum?.id === album.id ? "selected" : ""}`}
                                        onClick={() => setSelectedAlbum(album)}
                                        style={{
                                            transform: `translateX(-${(selectedAlbumIndex - i) * 200}px)`, // Плавне переміщення
                                        }}
                                    >
                                        <img src={album.photo} className="album-photo" alt={album.name}/>
                                        <p className="album-name">{album.name}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="carousel-button right" onClick={handleNext}>
                                &#62;
                            </button>
                        </div>

                        {/* Список треків вибраного альбому */}
                        {selectedAlbum && (
                            <div className="album-tracks">
                                <h3>{selectedAlbum.name}</h3>
                                <div className="album-track-list">
                                    {albumTracks.map((track, i) => (
                                        <div key={i} className="album-track"
                                             onClick={() => setCurrentTrack({...track, albumName: selectedAlbum.name})}>
                                            <div className="track-info">
                                                <button className="play-btn">▶</button>
                                                <div>
                                                    <p className="track-title">{track.title}</p>
                                                    <p className="track-artist">{artistData.artist.name}</p>
                                                </div>
                                            </div>
                                            <p className="track-duration">{new Date(track.duration_ms).toISOString().substr(14, 5)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </MainPageWrapper>

    );
}