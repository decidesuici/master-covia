import axios from 'axios'

export const liveCameras = async (request, response) => {
    const { url, cokie } = request.body

    if (!url || !cokie) {
        return response.status(400).json({ error: 'Missing url or cookie parameter' })
    }

    const configLinkCamera = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
            'Cookie': cokie,
            'Accept': 'application/json'
        }
    }

    try {
        const requestLinkCamera = await axios.request(configLinkCamera)
        return response.json(requestLinkCamera.data)
    } catch (error) {
        return response.status(500).json({ error: 'Error linking camera' })
    }
}