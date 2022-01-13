import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnectAPI } from '../../../libs/dbconnect'
import User from '../../../models/user'
import Movie from '../../../models/movie'
import { getSession } from 'next-auth/react'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ msg: 'not authorized to use this route' })
  }
  if (req.method === 'PATCH') {
    try {
      const userId = session.user!.name
      const { imdbid, title, year, poster } = req.body

      const foundUser = await User.findById(userId)

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
    const userId = session.user!.name

    const foundUser = await User.findById(userId)

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
    foundUser.watchlist = foundUser.watchlist.filter((id: string) => id !== imdbid)

    await foundUser.save()
    res.status(201).json({ success: true, msg: 'removed from watchlist' })
  } else {
    res.status(400).json({ msg: 'method not supported' })
  }
}

export default dbConnectAPI(handler)
