import express from 'express'
import { ImagesController } from '../../../controllers/api/images-controller.js'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export const router = express.Router()

const controller = new ImagesController()

const authenticateJWT = (req, res, next) => {
    const auth = req.headers.authorization?.split(' ')
    const scheme = auth[0]
    const token = auth[1]
    
    if (scheme !== 'Bearer') {
        next(createError(401))
        return
    }
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    req.user = {
      username: payload.sub,
      firstName: payload.first_name,
      lastName: payload.last_name,
      email: payload.email,
      permissionLevel: payload.x_permission_level
    }
    next()
  } catch (error) {
      const err = createError(401)
      err.cause = error
      next(err)
  }
}

router.post('/', (req, res, next) => controller.createImage(req, res, next))
