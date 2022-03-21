import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  imageUrl: {
    type: String
  },
  description: {
    type: String,
    minlength: 1,
    trim: true
  },
  location: {
    type: String
  },
  imageId: {
    type: String
  },
  userId: {
    type: String
  },
  contentType: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    /**
     * Removes sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    },
    virtuals: true
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

export const Image = mongoose.model('Image', schema)
