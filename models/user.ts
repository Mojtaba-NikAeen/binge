import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    watchlist: [{ type: mongoose.Schema.Types.String }],
    watched: [{ type: mongoose.Schema.Types.String }]
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

UserSchema.virtual('watchlistV', {
  ref: 'Movie',
  localField: 'watchlist',
  foreignField: 'imdbid'
})

UserSchema.virtual('watchedV', {
  ref: 'Movie',
  localField: 'watched',
  foreignField: 'imdbid'
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
