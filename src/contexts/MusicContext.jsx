import React, { createContext, useState, useContext, useCallback } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
    const [queue, setQueue] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);

    const playTrack = useCallback((trackDetails, index) => {
        setCurrentTrack(trackDetails);
        setCurrentTrackIndex(index);
        // також можна тут запускати audio.play()
    }, []);

    const playNext = useCallback(() => {
        if (currentTrackIndex == null) return;
        const next = currentTrackIndex + 1;
        if (next < queue.length) {
            playTrack(queue[next], next);
        }
    }, [currentTrackIndex, queue, playTrack]);

    const playPrev = useCallback(() => {
        if (currentTrackIndex > 0) {
            playTrack(queue[currentTrackIndex - 1], currentTrackIndex - 1);
        }
    }, [currentTrackIndex, queue, playTrack]);

    const removeFromQueue = useCallback((idx) => {
        setQueue(q => {
            const copy = [...q];
            copy.splice(idx, 1);
            // якщо видаляємо трек до або рівно поточному,
            // треба поправити індекс
            if (idx <= currentTrackIndex) {
                setCurrentTrackIndex(i => Math.max(i - 1, 0));
            }
            return copy;
        });
    }, [currentTrackIndex]);

    return (
        <MusicContext.Provider value={{
            queue, setQueue,
            currentTrack, currentTrackIndex,
            playTrack, playNext, playPrev,
            removeFromQueue
        }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    return useContext(MusicContext);
}
