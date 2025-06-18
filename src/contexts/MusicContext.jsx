import React, {createContext, useState, useContext, useCallback, useEffect} from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
    const [queue, setQueue] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isManualPlay, setIsManualPlay] = useState(false);


    useEffect(() => {
        const saved = localStorage.getItem("playerState");
        if (saved) {
            const data = JSON.parse(saved);
            if (data.queue && data.currentTrackIndex != null && data.currentTrack) {
                setQueue(data.queue);
                setCurrentTrackIndex(data.currentTrackIndex);
                setCurrentTrack(data.currentTrack);
            }
        }
    }, []);

    useEffect(() => {
        const data = {
            queue,
            currentTrackIndex,
            currentTrack
        };
        localStorage.setItem("playerState", JSON.stringify(data));
    }, [queue, currentTrackIndex, currentTrack]);

  


    const playTrack = useCallback((trackDetails, index) => {
        setCurrentTrack(trackDetails);
        setCurrentTrackIndex(index);
        localStorage.removeItem("playerTime");
        setIsManualPlay(true);
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
            removeFromQueue, isManualPlay, setIsManualPlay
        }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    return useContext(MusicContext);
}
