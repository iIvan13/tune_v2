import { type Song, songsTop, songsPopular } from "../../lib/data";
import type { APIRoute } from "astro";

interface RequestData {
    lib: string;
    id?: number;
    searchById: boolean
}

const librarySearch = (library: string) : Song[] | undefined => {
    switch (library) {
        case "songsTop":
            return songsTop
        case "songsPopular":
            return songsPopular
        default:
            return undefined
    }
}

const searchSongById = (songList: Song[], id: number, isById: boolean) => {
    return songList.find(song => {
        return isById ? song.id === id : song.indexPlay === id
    })
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const requestData: RequestData = await request.json();
        const library = requestData.lib;
        const isById = requestData.searchById;
        const id = requestData.id;

        const songList = librarySearch(library)

        if (!songList) {
            return new Response(JSON.stringify({ error: "Library not found" }), {
                status: 404,
                statusText: "Not Found Library",
            })
        }

        const song = searchSongById(songList, id, isById)

        if (!song) {
            return new Response(JSON.stringify({ error: "Song not found" }), {
                status: 404,
                statusText: "Not Found Song",
            })
        }

        return new Response(JSON.stringify(song), {
            status: 200,
            statusText: "OK",
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            statusText: "Internal Server Error",
        })
    }
}