import { useEffect, useState, useRef } from "react";
import { useMusicStore } from "../store/musicStore";
import { Loading, Pause, Play, PlayTrackNext, PlayTrackPrev } from "./PlayButtons";
import { fetchSong } from "../utils/fetchSong";
import SongControl from "./SongControl";

export default function Player() {
    const [like, setLike] = useState(false);
    const [drop, setDrop] = useState(false);
    const { isPlaying, setIsPlaying, playingMusic, setPlayingMusic, isLoading, setIsLoading } = useMusicStore();
    const { songBg, songTitle, songArtist, songUri } = playingMusic;

    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.play() : audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current && songUri !== audioRef.current.src) {
            audioRef.current.src = songUri;
            isPlaying ? audioRef.current.play() : audioRef.current.pause();
        }
    }, [songUri]);

    const handleClick = () => setIsPlaying(!isPlaying);


    const fetchNextSong = async (offset) => {
        setIsLoading(true);
        setIsPlaying(false);
        const res = await fetchSong({
            lib: playingMusic.typePlaylist,
            id: playingMusic.nextPlay + offset,
            searchById: false
        })
        setIsPlaying(true);
        const { id, cover, title, artist, audio, indexPlay } = res
        setPlayingMusic({
            id,
            songBg: cover,
            songTitle: title,
            songArtist: artist,
            songUri: audio,
            nextPlay: indexPlay,
            typePlaylist: playingMusic.typePlaylist
        })
        setIsLoading(false);
    }

    const classIconHeart = like ? "fill text-red-600" : "line";

    return (
        <footer className={`
            flex gap-4 fixed bottom-0 w-full md:px-10 bg-[#FFFFFF] shadow-2xl shadow-blue-950
            ${drop ? 'flex-col justify-between p-0' : 'justify-around p-4'}`}
            style={drop ? { height: "calc(100% - env(safe-area-inset-bottom)" } : {}}
        >
            {
                !drop ? (
                    <div className="flex items-center gap-2 w-[250px]">
                        <img
                            src={songBg}
                            alt={`${songTitle} - ${songArtist} - Image`}
                            className="rounded-full w-12 h-12  md:w-14 md:h-14"
                        />
                        <div className="flex-1 overflow-hidden max-w-[200px]">
                            <h3 className="text-base font-semibold truncate ... overflow-hidden">
                                {songTitle}
                            </h3>
                            <p className="text-zinc-500 text-sm truncate ... overflow-hidden">
                                {songArtist}
                            </p>
                        </div>
                    </div>
                ) : (
                    <article className="w-full h-full">
                        <div
                            style={{ backgroundImage: `url(${songBg})`, clipPath: "ellipse(110% 100% at 50% 0%)", height: "75%" }}
                            className="bg-cover bg-center bg-no-repeat"
                        >
                            <button
                                className="text-3xl font-medium grid place-content-center text-gray-400 pt-3 transition duration-300 rounded-full"
                                onClick={() => setDrop(!drop)}>
                                <i className="ri-arrow-left-s-line"></i>
                            </button>
                        </div>


                        <div className="w-full flex justify-center items-center mt-5 relative">
                            <div className="text-3xl absolute left-4 -top-8">
                                <i className="ri-shuffle-line"></i>
                            </div>
                            <div className="w-full text-center">
                                <h3 className="text-2xl font-semibold truncate ... overflow-hidden">
                                    {songTitle}
                                </h3>
                                <p className="text-zinc-500 text-lg truncate ... overflow-hidden">
                                    {songArtist}
                                </p>
                            </div>
                            <div onClick={() => setLike(!like)} className="text-3xl absolute right-4 -top-8">
                                <i className={`ri-heart-2-${classIconHeart}`}></i>
                            </div>
                        </div>
                    </article>
                )
            }
            <div className={`
                flex gap-6 items-center justify-between relative 
                ${drop ? "flex-col px-5" : ""}
            `}>
                <div className={`
                    text-4xl grid gap-2 place-content-center grid-flow-col w-fit
                    ${drop ? "pl-2 bottom-5 absolute z-50" : ""}
                `}>
                    <button onClick={() => fetchNextSong(-1)}>
                        <PlayTrackPrev />
                    </button>

                    <button className="text-black cursor-pointer w-fit" onClick={handleClick}>
                        {
                            isLoading ? (
                                <Loading lg={drop ?? true} />
                            ) : isPlaying ? (
                                <Play lg={drop ?? true} />
                            ) : (
                                <Pause lg={drop ?? true} />
                            )
                        }
                    </button>

                    <button onClick={() => fetchNextSong(1)}>
                        <PlayTrackNext />
                    </button>

                    <audio ref={audioRef} onEnded={() => fetchNextSong(1)}></audio>
                </div>

                <div className={`md:block ${drop ? "block w-full" : "hidden"}`}>
                    <SongControl audio={audioRef} classDrop={drop} />
                </div>
            </div>

            <button
                onClick={() => setDrop(!drop)}
                className={`md:hidden text-xl rounded-full h-5 w-5 flex text-white bg-blue-600 items-center absolute bottom-[70px] right-6 ${drop ? "hidden" : ""}`}>
                <i className="ri-arrow-up-s-line"></i>
            </button>
        </footer>
    )
}