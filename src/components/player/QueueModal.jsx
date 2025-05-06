import React from 'react';
import dummy from "@/assets/nav_logo.png";
import {FaClosedCaptioning, FaCross, FaCrosshairs, FaPlay} from "react-icons/fa";
import "./queue-modal.css"
import {FaXmark} from "react-icons/fa6";

const QueueModal = ({ isOpen, queue, closeModal }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <button onClick={closeModal} className="close-btn"><FaXmark/></button>
                    <h2 className="text-white font-bold">QUEUE</h2>
                </div>
                <ul className="queue-list">
                    {queue.map((track, idx) => (
                        <li key={idx} className="track-item">
                            <div className="track-content">
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
                                <div className="track-details">
                                    <p className="track-title">{track.title}</p>
                                    <p className="track-artist">{track.artists?.map(a => a.name).join(", ")}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QueueModal;
