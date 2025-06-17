import { useMusic } from "@/contexts/MusicContext";
import CustomAudioPlayer from "@/components/player/CustomAudioPlayer.jsx";

function GlobalPlayerWrapper() {
    const { currentTrack } = useMusic();

    if (!currentTrack) return null;

    return <CustomAudioPlayer />;
}

export default GlobalPlayerWrapper
