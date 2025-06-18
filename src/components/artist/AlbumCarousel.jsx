import React from "react";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";

export default function AlbumCarousel({ albums, selectedAlbum, onSelect }) {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        const index = albums.findIndex((a) => a.id === selectedAlbum?.id);
        if (index !== -1) setCurrentIndex(index);
    }, [selectedAlbum, albums]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + albums.length) % albums.length);
        onSelect(albums[(currentIndex - 1 + albums.length) % albums.length], (currentIndex - 1 + albums.length) % albums.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % albums.length);
        onSelect(albums[(currentIndex + 1) % albums.length], (currentIndex + 1) % albums.length);
    };

    const renderVisibleSlides = () => {
        const visible = [
            (currentIndex - 1 + albums.length) % albums.length,
            currentIndex,
            (currentIndex + 1) % albums.length,
        ];

        return visible.map((i) => {
            const album = albums[i];
            const isCenter = i === currentIndex;
            const scale = isCenter ? "scale-100 opacity-100 z-10" : "scale-90 opacity-60";

            return (
                <div
                    key={album.id}
                    className={`transition-transform duration-300 ease-in-out ${scale} mx-2 relative cursor-pointer`}
                    onClick={() => {
                        setCurrentIndex(i);
                        onSelect(album, i);
                    }}
                >
                    <img
                        src={album.photo}
                        alt={album.name}
                        className="w-40 h-40 md:w-56 md:h-56 object-cover rounded shadow-md mx-auto"
                    />
                    <p className="text-center mt-2 text-sm font-medium text-white">{album.name}</p>
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-5xl flex items-center justify-center py-4">
                <button
                    className="absolute left-0 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 shadow"
                    onClick={prevSlide}
                >
                    <FaArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center w-full overflow-hidden">
                    {renderVisibleSlides()}
                </div>

                <button
                    className="absolute right-0 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 shadow"
                    onClick={nextSlide}
                >
                    <FaArrowRight className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-center mt-2 gap-2">
                {albums.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${
                            i === currentIndex ? "bg-white" : "bg-white/30"
                        }`}
                    ></div>
                ))}
            </div>
        </div>
    );
}
