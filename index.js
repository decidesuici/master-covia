import { WebSocket, WebSocketServer } from 'ws'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { auth } from './routes/auth.js'
import { layers } from './routes/layers.js'
import { camera } from './routes/camera.js'
import fs from 'fs'
import https from 'https'

dotenv.config()

const app = express()
const PORT = 5005

// Cargar certificados SSL/TLS
const server = https.createServer({
    cert: fs.readFileSync('/ruta/a/tu/certificado.crt'),  // Ruta al certificado .crt
    key: fs.readFileSync('/ruta/a/tu/llaveprivada.key'),   // Ruta a la clave privada .key
    ca: fs.readFileSync('/ruta/a/tu/certificado_ca_bundle.crt')  // Ruta al CA bundle si lo tienes (opcional)
})

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

// Crear el servidor WebSocket sobre HTTPS
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

// Iniciar el servidor HTTPS con WebSocket seguro (WSS)
server.listen(PORT, () => {
    console.log(`Servidor HTTPS con WebSocket seguro (WSS) corriendo en el puerto ${PORT}`)
})
