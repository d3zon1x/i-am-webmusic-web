import React, {useState} from 'react';
import dummy from "@/assets/nav_logo.png";
import "./queue-modal.css"
import {FaXmark} from "react-icons/fa6";
import {FaPlay, FaTimes} from "react-icons/fa";
import {useMusic} from "@/contexts/MusicContext.jsx";
import {Clock} from "lucide-react";

const QueueModal = ({ isOpen, closeModal, className}) => {
    const { queue, currentTrackIndex, playTrack, removeFromQueue } = useMusic();
    const [hoveredTrack, setHoveredTrack] = useState(null);

    if (!isOpen) return null;

    

    return (
        <div className={`modal-overlay ${className}`}>
            <div className="modal-content scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <div className="modal-header">
                    <button onClick={closeModal} className="close-btn"><FaXmark/></button>
                    <h2 className="text-white font-bold">QUEUE</h2>
                </div>
                <ul className="queue-list ">
                    {queue.map((track, idx) => (
                        <li key={idx}
                            onMouseEnter={() => setHoveredTrack(idx)}
                            onMouseLeave={() => setHoveredTrack(null)}    
                            className={`track-item hover:bg-white/20 transition group`}>

                            <div className="track-content justify-between">
                                <div className="flex items-center">
                                    {currentTrackIndex === idx && (
                                        <div className="track-indicator-container">
                                            <div className="track-indicator"></div>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <img
                                            src={track.thumbnail}
                                            alt={track.title}
                                            className="track-thumbnail object-cover group-hover:brightness-50"
                                            onError={(e) => {
                                                e.target.src = dummy
                                            }}
                                        />
                                        {((hoveredTrack === idx) && (currentTrackIndex !== idx)) && (
                                            <button onClick={() => playTrack(track, idx)}
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full shadow-lg transition-opacity duration-200">
                                                <FaPlay className="w-3 h-3 text-white"/>
                                            </button>
                                        )}
                                    </div>
                                    <div className="track-details text-left">
                                        <p className="track-title">{track.title}</p>
                                        <p className="track-artist">{track.artist}</p>

                                    </div>
                                </div>
                                {hoveredTrack !== idx && (
                                    <div className="text-sm text-white/60 flex items-center gap-1">
                                        <p>{track.duration}</p>
                                        <Clock className="w-4 h-4"/>
                                    </div>
                                )}
                                {((currentTrackIndex !== idx) && (hoveredTrack === idx)) && (
                                    <div>


                                        <button
                                            onClick={() => removeFromQueue(idx)}
                                            className="track-action-btn remove-btn"
                                        >
                                            <FaTimes/>
                                        </button>
                                    </div>)}
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QueueModal;
