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
      console.log(data)

      const image = new Image({
        imageUrl: data.imageUrl,
        description: req.body.description,
        location: req.body.location,
        imageId: data.id,
        user: req.user.username,
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

  async getAllImages(req, res, next) {
      try {
          const images = await Image.find({})
          const resImages = []
          images.forEach(image => {
              if (image.user === req.user.username) {
                resImages.push({
                    imageUrl: image.imageUrl,
                    description: image.description,
                    location: image.location,
                    createdAt: image.createdAt,
                    updatedAt: image.updatedAt,
                    id: image.id
                })
              }
          })
          res.json(resImages)
      } catch (error) {
          next(error)
      }
  }

  async setImage(req, res, next, id) {
    try {
        const image = await Image.findById(id)
        console.log(image)
        req.image = image
        next()
    } catch (error) {
        next(error)
    }
  }

  async getSingleImage(req, res, next) {
      try {
          const image = {
              imageUrl: req.image.imageUrl,
              description: req.image.description,
              location: req.image.location,
              createdAt: req.image.createdAt,
              updatedAt: req.image.updatedAt,
              id: req.image.id
          }
          console.log(image)
          res.json(image)
      } catch (error) {
          next(error)
      }
  }

  async deleteImage(req, res, next) {
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
}
