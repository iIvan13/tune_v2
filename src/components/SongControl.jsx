import { useEffect, useState } from "react"

export default function SongControl({ audio, classDrop }) {
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        audio.current.addEventListener("timeupdate", audioTimeUpdate)

        return () => {
            audio.current.removeEventListener("timeupdate", audioTimeUpdate)
        }
    }, [])

    const audioTimeUpdate = () => {
        setCurrentTime(audio.current.currentTime)
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const duration = audio.current?.duration ?? 0
    const result = typeof duration === "number" && !isNaN(duration) ? duration : 0

    return (
        <div className={`
            w-full md:w-[350px] lg:w-[500px] items-center gap-4 flex relative
            ${classDrop ? "h-[30px] pb-32" : ""}
        `}>
            <span className="w-8">
                {formatTime(currentTime)}
            </span>
            <input
                type="range"
                value={currentTime}
                max={result}
                min={0}
                onChange={(e) => {
                    const newCurrentTime = e.target.value
                    audio.current.currentTime = newCurrentTime
                }}
                className="w-full h-full appearance-none flex items-center cursor-pointer bg-transparent z-30
                [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:appearance-none
                [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:appearance-none
                [&::-ms-thumb]:bg-blue-400  [&::-ms-thumb]:rounded-full [&::-ms-thumb]:border-0 [&::-ms-thumb]:w-2.5 [&::-ms-thumb]:h-2.5 [&::-ms-thumb]:appearance-none
                [&::-webkit-slider-runnable-track]:bg-blue-100 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:overflow-hidden [&::-moz-range-track]:bg-blue-100 [&::-moz-range-track]:rounded-full [&::-ms-track]:bg-blue-100 [&::-ms-track]:rounded-full
                [&::-moz-range-progress]:bg-blue-400  [&::-moz-range-progress]:rounded-full [&::-ms-fill-lower]:bg-blue-400  [&::-ms-fill-lower]:rounded-full [&::-webkit-slider-thumb]:shadow-[-999px_0px_0px_990px_#4e97ff]"
            />
            <span className="w-8">
                {duration ? formatTime(duration) : "0:00"}
            </span>
        </div>
    )
}