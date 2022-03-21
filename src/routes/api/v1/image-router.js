import express from 'express'
import { ImagesController } from '../../../controllers/api/images-controller.js'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export const router = express.Router()

const controller = new ImagesController()

/**
 *
 * @param req
 * @param res
 * @param next
 */
const authenticateJWT = (req, res, next) => {
  const auth = req.headers.authorization?.split(' ')

  if (auth?.[0] !== 'Bearer') {
    next(createError(401))
    return
  }

  try {
    const payload = jwt.verify(auth[1], process.env.ACCESS_TOKEN_SECRET)
    req.user = {
      username: payload.sub,
      permissionLevel: payload.x_permission_level
    }
    next()
  } catch (error) {
    console.log(error)
    const err = createError(401)
    err.cause = error
    next(err)
  }
}

router.param('id', (req, res, next, id) => controller.setImage(req, res, next, id))
router.get('/', authenticateJWT, (req, res, next) => controller.getAllImages(req, res, next))
router.post('/', authenticateJWT, (req, res, next) => controller.createImage(req, res, next))
