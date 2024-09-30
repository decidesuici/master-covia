import { Router } from 'express'
import { signin } from '../controllers/auth.js'

export const auth = Router()

auth.post('/signin', signin)