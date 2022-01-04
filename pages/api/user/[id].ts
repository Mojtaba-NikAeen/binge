import { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/user'
import { dbConnectAPI } from '../../../libs/dbconnect'
import Movie from '../../../models/movie'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(400).json({ msg: 'fuck you and your unsuppoted method' })
    return
  }
  // TODO extract id from cookie and lots of other shit
  const foundUser = await User.findOne({ _id: '61d2a3e9d90850e0045a3553' }).populate({
    path: 'watchlistV watchedV',
    model: Movie
  })

  res.status(200).json({ data: foundUser })
}

export default dbConnectAPI(handler)
