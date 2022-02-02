import { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/user'
import { dbConnectAPI } from '../../../libs/dbconnect'
import Movie from '../../../models/movie'
import { getSession } from 'next-auth/react'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(400).json({ msg: 'method not supported' })
    return
  }
  try {
    const session = await getSession({ req })
    if (!session) {
      return res.status(401).json({ msg: 'not authorized to use this route' })
    }

    const foundUser = await User.findOne({ _id: session!.user?.name })
      .select('watchlist watched')
      .populate({
        path: 'watchlistV watchedV',
        model: Movie
      })

    res.status(200).json({ data: foundUser })
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Server Error, try again later' })
  }
}

export default dbConnectAPI(handler)
