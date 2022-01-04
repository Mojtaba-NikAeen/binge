import mongoose from 'mongoose'

const MovieSchema = new mongoose.Schema({
  imdbid: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  poster: {
    type: String
  }
})

export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema)
