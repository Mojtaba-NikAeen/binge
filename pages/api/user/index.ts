import { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/user'
import { dbConnectAPI } from '../../../libs/dbconnect'
import Movie from '../../../models/movie'
import { getSession } from 'next-auth/react'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ msg: 'not authorized to use this route' })
  }

  if (req.method !== 'GET') {
    res.status(400).json({ msg: 'fuck you and your unsuppoted method' })
    return
  }

  const foundUser = await User.findOne({ _id: session.user?.name }).populate({
    path: 'watchlistV watchedV',
    model: Movie
  })

  res.status(200).json({ data: foundUser })
}

export default dbConnectAPI(handler)
