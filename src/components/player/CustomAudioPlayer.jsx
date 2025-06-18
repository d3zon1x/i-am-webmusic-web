import { useEffect, useRef, useState } from "react";
import {FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaList, FaAlignLeft} from "react-icons/fa";
import dummy from "../../assets/nav_logo.png"
import "./queue-modal.css"
import "./player-style.css"
import CustomAudioProgressBar from "@/components/player/CustomAudioProgressBar.jsx";
import VolumeSlider from "@/components/player/VolumeSlider.jsx";
import QueueModal from "@/components/player/QueueModal.jsx";
import {useMusic} from "@/contexts/MusicContext.jsx";

export default function CustomAudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);  // Спочатку встановлюємо на false, тому що трек ще не почав грати
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5); // volume set to 50% by default
    const [thumbnailValid, setThumbnailValid] = useState(true); // Стейт для перевірки валідності прев'юшки
    const audioRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const {currentTrack, playNext, playPrev, currentTrackIndex, isManualPlay, setIsManualPlay } = useMusic();

    


    // useEffect(() => {
    //     const audio = audioRef.current;
    //     if (!audio) return;
    //     if (audio && currentTrack?.url) {
    //         audio.play().catch(error => {
    //             console.error("Error trying to play the audio:", error);
    //         });
    //         setIsPlaying(true);
    //     }
    //
    //     // localStorage.removeItem("playerTime");
    //     const savedTime = parseFloat(localStorage.getItem("playerTime"));
    //     if (!isNaN(savedTime)) {
    //         audio.currentTime = savedTime;
    //     }
    //     const updateProgress = () => setProgress(audio.currentTime);
    //     const setAudioDuration = () => setDuration(audio.duration);
    //
    //     if (isManualPlay) {
    //         audio.play().catch(err => console.error("play error", err));
    //         setIsPlaying(true);
    //         setIsManualPlay(false); 
    //     }
    //
    //     audio.addEventListener("timeupdate", updateProgress);
    //     audio.addEventListener("loadedmetadata", setAudioDuration);
    //
    //     return () => {
    //         audio.removeEventListener("timeupdate", updateProgress);
    //         audio.removeEventListener("loadedmetadata", setAudioDuration);
    //     };
    // }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack?.url) return;

        // localStorage.removeItem("playerTime");

        const savedTime = parseFloat(localStorage.getItem("playerTime"));
        if (!isNaN(savedTime)) {
            audio.currentTime = savedTime;
        }

        const updateProgress = () => setProgress(audio.currentTime);
        const setAudioDuration = () => setDuration(audio.duration);

        if (isManualPlay) {
            audio.play().catch(err => console.error("play error", err));
            setIsPlaying(true);
            setIsManualPlay(false); 
        }

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", setAudioDuration);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", setAudioDuration);
        };
    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const saveTime = () => {
            if (currentTrack?.url) {
                localStorage.setItem("playerTime", audio.currentTime.toString());
            }
        };

        audio.addEventListener("timeupdate", saveTime);
        return () => audio.removeEventListener("timeupdate", saveTime);
    }, [currentTrack]);

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);  // Змінюємо статус плеєра
        }
    };

    const seekAudio = (value) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setProgress(value);
        }
    };

    const formatTime = (sec) => {
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const handleVolumeChange = (volume) => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
        setVolume(volume);
    };

    const checkThumbnailValidity = (url) => {
        const img = new Image();
        img.src = url;
        img.onload = () => setThumbnailValid(true);  // Картинка є валідною
        img.onerror = () => setThumbnailValid(false);  // Картинка поламана
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    

    useEffect(() => {
        if (currentTrack?.thumbnail) {
            checkThumbnailValidity(currentTrack.thumbnail);
        }
    }, [currentTrack?.thumbnail]);

  

    return (
        <div className="custom-container">
            {/* Прев'ю */}
            <div className="custom-preview">
                {thumbnailValid ? (
                    <img
                        src={currentTrack?.thumbnail || dummy}
                        alt={currentTrack?.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <img
                        src={dummy}
                        alt="fallback"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                )}
            </div>
            <div
                className="custom-audio-player w-full bg-black p-4 shadow-lg fixed bottom-0 left-1/2 transform -translate-x-1/2">
                {/* Track Info */}
                <div className="player-info">
                    <div className="track-details">
                        <p>{currentTrack?.title || "Track Name"}</p>
                        <p className="artist">{currentTrack?.artist || "Artist Name"}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full mb-2 flex gap-1 flex-col items-center control-container">
                    <div className="progress-bar-container w-full flex justify-center mt-4">
                        <CustomAudioProgressBar
                            progress={progress}
                            duration={duration}
                            onChange={(val) => seekAudio(val)}
                        />
                    </div>
                    <div className="flex items-center gap-2 justify-between w-full control-container">
                        <span className="text-xs text-gray-400 mt-1">{formatTime(progress)}</span>
                        <div className="flex justify-between gap-3 mt-3">
                            <button onClick={() => playPrev()} className="text-white">
                                <FaStepBackward/>
                            </button>
                            <button onClick={togglePlayback} className="text-white">
                                {isPlaying ? <FaPause className="w-6 h-6"/> : <FaPlay className="w-6 h-6"/>}
                            </button>
                            <button onClick={() => playNext()} className="text-white">
                                <FaStepForward/>
                            </button>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="volume-control">
                        <button onClick={toggleModal}>
                            <FaList/>
                        </button>
                        {/*<button>*/}
                        {/*    <FaAlignLeft/>*/}
                        {/*</button>*/}
                    </div>
                    <div className="volume-control">
                    <FaVolumeUp className="text-white"/>
                        <VolumeSlider volume={volume} onChange={handleVolumeChange}/>
                    </div>
                </div>

               

                {/* Audio */}
                <audio ref={audioRef} src={currentTrack?.url} onEnded={() => setIsPlaying(false)}/>
            </div>
            <QueueModal 
                isOpen={isModalOpen} 
                closeModal={toggleModal}
                className={isModalOpen ? 'open' : ''}
            /> 

        </div>
    );
}