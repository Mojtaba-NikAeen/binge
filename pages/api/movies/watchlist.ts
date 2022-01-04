import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnectAPI } from '../../../libs/dbconnect'
import User from '../../../models/user'
import Movie from '../../../models/movie'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    try {
      const { imdbid, title, year, poster } = req.body

      // TODO extract user id from cookie
      const foundUser = await User.findById('61d2a3e9d90850e0045a3553')

      if (!foundUser) {
        res.status(404).json({ msg: 'user not found' })
        return
      }

      if (foundUser.watchlist.includes(imdbid)) {
        res.status(400).json({ msg: 'imdbid already in watchlist' })
        return
      }

      if (foundUser.watched.includes(imdbid)) {
        res
          .status(400)
          .json({ msg: 'you already watched this movie, remove it from watched page first' })
        return
      }

      foundUser.watchlist.push(imdbid)

      const response = await foundUser.save()
      const foundMovie = await Movie.findOne({ imdbid: imdbid })
      if (!foundMovie) {
        const newMovie = new Movie({
          imdbid,
          title,
          year,
          poster
        })

        await newMovie.save()
      }
      res.status(201).json({ data: response, msg: 'added to watchlist' })
    } catch (error) {
      res.status(500).json({ msg: 'something went wrong' })
    }
  } else if (req.method === 'DELETE') {
    const { imdbid } = req.body

    const foundUser = await User.findById('61d2a3e9d90850e0045a3553')

    if (!foundUser) console.log('not found user watchlist.ts')

    if (!foundUser.watchlist.includes(imdbid)) {
      res.status(400).json({ msg: 'no such id in watchlist, try again maybe' })
      return
    }
    if (foundUser.watchlist.length === 1) {
      foundUser.watchlist = []
      const response = await foundUser.save()
      res.status(201).json({ data: response, msg: 'removed from watchlist' })
      return
    }
    foundUser.watchlist.filter((id: string) => id !== imdbid)

    const response = await foundUser.save()
    res.status(201).json({ data: response, msg: 'removed from watchlist' })
  } else {
    res.status(400).json({ msg: 'method not supported on this route' })
  }
}

export default dbConnectAPI(handler)
