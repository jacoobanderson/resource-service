import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'

try {
  await connectDB()

  const app = express()

  app.use(helmet())

  app.use(logger('dev'))

  app.use(express.json())

  app.use((express.json({ limit: '500kb' })))

  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500

    if (err.status === 401) {
      err.message = 'Access token invalid or not provided'
    } else if (err.status === 400) {
      err.message = 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).'
    } else if (err.status === 404) {
      err.message = 'The requested resource was not found.'
    } else if (err.status === 403) {
      err.message = 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'
    }

    if (req.app.get('env') !== 'development') {
      return res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
    }

    // Development only!
    // Only providing detailed error in development.
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message
      })
  })

  // Starts the HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
