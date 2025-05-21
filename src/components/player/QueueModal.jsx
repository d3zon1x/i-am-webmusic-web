import React from 'react';
import dummy from "@/assets/nav_logo.png";
import "./queue-modal.css"
import {FaXmark} from "react-icons/fa6";

const QueueModal = ({ isOpen, queue, closeModal, className, currentTrackIndex }) => {
    if (!isOpen) return null;

    const handleRemoveTrack = (index) => {
        if (currentTrackIndex !== index) {
            queue = queue.filter((_, i) => i !== index);
        }
    };

    return (
        <div className={`modal-overlay ${className}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <button onClick={closeModal} className="close-btn"><FaXmark/></button>
                    <h2 className="text-white font-bold">QUEUE</h2>
                </div>
                <ul className="queue-list">
                    {queue.map((track, idx) => (
                        <li key={idx}                             
                            className={`track-item`}>

                            <div className="track-content">

                                {currentTrackIndex === idx && (
                                    <div className="track-indicator-container">
                                        <div className="track-indicator"></div>
                                    </div>
                                )}

                                <div className="relative">
                                    <img
                                        src={track.thumbnail}
                                        alt={track.title}
                                        className="track-thumbnail"
                                        onError={(e) => {
                                            e.target.src = dummy
                                        }}
                                    />

                                </div>
                                <div className="track-details text-left">
                                    <p className="track-title">{track.title}</p>
                                    <p className="track-artist">{track.artist}</p>

                                </div>
                                <button onClick={() => handleRemoveTrack(idx)} className="remove-btn">
                                    Remove
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QueueModal;
