import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp } from "react-icons/fa";
import dummy from "../../assets/nav_logo.png"
import "./player-style.css"
import CustomAudioProgressBar from "@/components/player/CustomAudioProgressBar.jsx";
import VolumeSlider from "@/components/player/VolumeSlider.jsx";

export default function CustomAudioPlayer({ track }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5); 
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => setProgress(audio.currentTime);
        const setAudioDuration = () => setDuration(audio.duration);

        audio.play();
        setIsPlaying(true); 

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", setAudioDuration);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", setAudioDuration);
        };
    }, [track]);

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying); 
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



    return (
        <div className="custom-container">
            {/* Прев'ю */}
            <div className="custom-preview">
                <img
                    src={track?.thumbnail || dummy}
                    alt={track?.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                    className="track-thumbnail"
                />
            </div>

            <div className="custom-audio-player w-full bg-black p-4 shadow-lg fixed bottom-0 left-1/2 transform -translate-x-1/2">
                {/* Track Info */}
                <div className="player-info">
                    <div className="track-details">
                        <p>{track?.title || "Track Name"}</p>
                        <p className="artist">{track?.artist || "Artist Name"}</p>
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
                            <button
                                onClick={() => seekAudio(progress - 10)}
                                className="text-white transition-all hover:scale-110 hover:text-red-500"
                            >
                                <FaStepBackward />
                            </button>
                            <button
                                onClick={togglePlayback}
                                className="text-white transition-all hover:scale-110 hover:text-red-500"
                            >
                                {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
                            </button>
                            <button
                                onClick={() => seekAudio(progress + 10)}
                                className="text-white transition-all hover:scale-110 hover:text-red-500"
                            >
                                <FaStepForward />
                            </button>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="volume-control flex items-center gap-2">
                        <FaVolumeUp className="text-white transition-all hover:scale-110 hover:text-red-500" />
                        <VolumeSlider volume={volume} onChange={handleVolumeChange} />
                    </div>
                </div>

                {/* Audio */}
                <audio ref={audioRef} src={track?.url} onEnded={() => setIsPlaying(false)} />
            </div>
        </div>
    );
}
