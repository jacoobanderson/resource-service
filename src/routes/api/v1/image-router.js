import express from 'express'
import { ImagesController } from '../../../controllers/api/images-controller.js'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export const router = express.Router()

const controller = new ImagesController()

const PermissionLevels = Object.freeze({
  READ: 1,
  CREATE: 2,
  UPDATE: 4,
  DELETE: 8
})

/**
 * Authenticates the jwt.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
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
      permissionLevel: payload.x_permission_level,
      id: payload.id
    }
    next()
  } catch (error) {
    console.log(error)
    const err = createError(401)
    err.cause = error
    next(err)
  }
}

/**
 * Checks if a user has permission or not.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {object} permissionLevel - The level of permission.
 */
const checkPermission = (req, res, next, permissionLevel) => {
  req.user?.permissionLevel & permissionLevel ? next() : next(createError(403))
}

router.param('id', (req, res, next, id) => controller.setImage(req, res, next, id))
router.get('/',
  authenticateJWT,
  (req, res, next) => checkPermission(req, res, next, PermissionLevels.READ),
  (req, res, next) => controller.getAllImages(req, res, next))

router.post('/', authenticateJWT,
  (req, res, next) => checkPermission(req, res, next, PermissionLevels.CREATE),
  (req, res, next) => controller.createImage(req, res, next))

router.get('/:id', authenticateJWT,
  (req, res, next) => checkPermission(req, res, next, PermissionLevels.READ),
  (req, res, next) => controller.getSingleImage(req, res, next))

router.delete('/:id', authenticateJWT,
  (req, res, next) => checkPermission(req, res, next, PermissionLevels.DELETE),
  (req, res, next) => controller.deleteImage(req, res, next))

router.put('/:id', authenticateJWT,
  (req, res, next) => checkPermission(req, res, next, PermissionLevels.UPDATE),
  (req, res, next) => controller.editImage(req, res, next))

router.patch('/:id', authenticateJWT,
  (req, res, next) => checkPermission(req, res, next, PermissionLevels.UPDATE),
  (req, res, next) => controller.partiallyEditImage(req, res, next))
