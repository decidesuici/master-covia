import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const layers = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

layers.get('/ductos_pemex', (request, response) => {
    const kmlPath = path.join(__dirname, '..', 'assets', 'KML', 'DuctosPemex.kml')
    response.sendFile(kmlPath)
})

layers.get('/fosas', (request, response) => {
    const kmlPath = path.join(__dirname, '..', 'assets', 'KML', 'Fosas.kml')
    response.sendFile(kmlPath)
})

layers.get('/policias_fallecidos', (request, response) => {
    const kmlPath = path.join(__dirname, '..', 'assets', 'KML', 'PoliciasFallecidos.kml')
    response.sendFile(kmlPath)
})

layers.get('/servicio_carretero', (request, response) => {
    const kmlPath = path.join(__dirname, '..', 'assets', 'KML', 'ServicioCarretero.kml')
    response.sendFile(kmlPath)
})