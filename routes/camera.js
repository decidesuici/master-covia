import { Router } from 'express'
import { liveCameras } from '../controllers/camera.js'

export const camera = Router()

camera.post('/live_camera', liveCameras)