import { Image } from '../../models/image.js'
import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class ImagesController {
  /**
   * Creates an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createImage (req, res, next) {
    try {
      const response = await fetch(process.env.IMAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
        },
        body: JSON.stringify({
          data: req.body.data,
          contentType: req.body.contentType
        })
      })
      const data = await response.json()

      const image = new Image({
        imageUrl: data.imageUrl,
        description: req.body.description,
        location: req.body.location,
        imageId: data.id,
        userId: req.user.id,
        contentType: data.contentType
      })

      await image.save()

      const responseImage = {
        imageUrl: image.imageUrl,
        contentType: image.contentType,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
        id: image.imageId
      }
      res
        .status(201)
        .json(responseImage)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Gets all the images.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllImages (req, res, next) {
    try {
      const images = await Image.find({})
      const resImages = []
      images.forEach(image => {
        resImages.push({
          imageUrl: image.imageUrl,
          description: image.description,
          location: image.location,
          createdAt: image.createdAt,
          updatedAt: image.updatedAt,
          id: image.id
        })
      })
      res.json(resImages)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sets the image in req.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The id of the image.
   */
  async setImage (req, res, next, id) {
    try {
      const image = await Image.findById(id)
      req.image = image
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Gets a single image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getSingleImage (req, res, next) {
    try {
      const image = {
        imageUrl: req.image.imageUrl,
        description: req.image.description,
        location: req.image.location,
        createdAt: req.image.createdAt,
        updatedAt: req.image.updatedAt,
        id: req.image.id
      }
      res.json(image)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteImage (req, res, next) {
    try {
      await fetch(process.env.IMAGE_URL + '/' + req.image.imageId, {
        method: 'DELETE',
        headers: {
          'X-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
        }
      })

      await req.image.delete()
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Edits an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async editImage (req, res, next) {
    try {
      await fetch(process.env.IMAGE_URL + '/' + req.image.imageId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
        },
        body: JSON.stringify({
          data: req.body.data,
          contentType: req.body.contentType,
          description: req.body.description,
          location: req.body.location
        })
      })
      await req.image.update({
        data: req.body.data,
        contentType: req.body.contentType,
        description: req.body.description,
        location: req.body.location
      })
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Partially edits an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async partiallyEditImage (req, res, next) {
    try {
      await fetch(process.env.IMAGE_URL + '/' + req.image.imageId, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
        },
        body: JSON.stringify({
          description: req.body.description
        })
      })

      await req.image.update({
        description: req.body.description
      })
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}
