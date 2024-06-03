import { useMusicStore } from "../store/musicStore"
import { fetchSong } from "../utils/fetchSong"

export default function CardPlay({ songId }) {

    const { isPlaying, setIsPlaying, playingMusic, setPlayingMusic, setIsLoading } = useMusicStore()

    const isPlayingSong = isPlaying && playingMusic?.id === songId

    const handleClick = () => {
        if (playingMusic?.id === songId) {
            setIsPlaying(!isPlaying)
            return
        }

        const playNewSong = async () => {
            setIsLoading(true)
            setIsPlaying(false)
            const data = await fetchSong({ 
                lib: playingMusic.typePlaylist === "songsPopular"
                    ? "songsTop" 
                    : playingMusic.typePlaylist || "songsTop", 
                id: songId, 
                searchById: true
            })
            setIsPlaying(true)
            const { id, cover, title, artist, audio, indexPlay } = data
            setPlayingMusic(
                {
                    id,
                    songBg: cover,
                    songTitle: title,
                    songArtist: artist,
                    songUri: audio,
                    nextPlay: indexPlay,
                    typePlaylist: "songsTop"
                }
            )
            setIsLoading(false)
        }

        playNewSong()
    }

    return (
        <button className="absolute text-blue-600 text-7xl bottom-16 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500"
            onClick={handleClick}>
            {
                isPlayingSong ? (
                    <i className="ri-pause-circle-fill onplay"></i>
                ) : (
                    <i className="ri-play-circle-fill onplay"></i>
                )
            }
        </button>
    )
}