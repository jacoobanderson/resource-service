import createError from 'http-errors'
import { Image } from '../../models/image.js'
import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class ImagesController {
  /**
   *
   * @param req
   * @param res
   * @param next
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
        imageId: data.id
      })

      const responseImage = {
        id: image.imageId,
        imageUrl: image.imageUrl,
        contentType: req.body.contentType,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt
      }
      res
        .status(201)
        .json(responseImage)
    } catch (error) {
      next(error)
    }
  }
}
