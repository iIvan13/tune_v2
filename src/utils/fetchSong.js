export const fetchSong = async (requestData) => {
    try {
        const res = await fetch('/api/songApi.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })

        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }

        const data = await res.json()
        return data

    } catch (error) {
        console.error(error)
    }
}