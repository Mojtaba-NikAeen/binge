import mongoose from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

const dbString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`

export const dbConnectAPI =
  (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (mongoose.connections[0].readyState) {
      // using current db connection
      console.log('using existing db connection')
      return handler(req, res)
    }

    // creating new db connection
    try {
      const connection = await mongoose.connect(dbString)
      console.log(`new MongoDB connection was established: ${connection.connection.host}`)
      return handler(req, res)
    } catch (error: any) {
      console.log(error.message || 'connecting to DB failed')
    }
  }

export const dbConnect = async () => {
  if (mongoose.connections[0].readyState) {
    // using current db connection
    console.log('using existing db connection')
    return
  }

  // creating new db connection
  try {
    const connection = await mongoose.connect(dbString)
    console.log(`new MongoDB connection was established: ${connection.connection.host}`)
    return
  } catch (error: any) {
    console.log(error.message || 'connecting to DB failed')
  }
}
