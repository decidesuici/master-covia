import { WebSocket, WebSocketServer } from 'ws'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { auth } from './routes/auth.js'
import { layers } from './routes/layers.js'
import { camera } from './routes/camera.js'

dotenv.config()

const app = express()
const PORT = 5005

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(auth)
app.use(layers)
app.use(camera)

app.post('/connect', (request, response) => {
    const { cokie } = request.body
    connectToWebSocket(cokie)
    response.status(200).send('Conexión WebSocket establecida.')
})

const server = app.listen(PORT, () => {
    console.log(`Servidor proxy escuchando en http://localhost:${PORT}`)
})

const wss = new WebSocketServer({ server })

function connectToWebSocket(cokie) {
    let originalWs = new WebSocket(process.env.SOCKET, {
        headers: {
            Cookie: cokie,
        },
    })

    originalWs.on('error', (error) => {
        console.error('Error en el WebSocket original:', error)
    })

    originalWs.on('message', (message) => {

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if (JSON.parse(message.toString()).positions) {
                    if (JSON.parse(message.toString()).positions[0].speed != 0) {
                        client.send(message.toString())
                    }
                } else {
                    client.send(message.toString())
                }
            }
        })
    })
}