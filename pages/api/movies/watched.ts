import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { dbConnectAPI } from '../../../libs/dbconnect'
import User from '../../../models/user'
import Movie from '../../../models/movie'

interface ResponseData {
  msg: string
  success: boolean
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ success: false, msg: 'not authorized to use this route' })
  }
  if (req.method === 'PATCH') {
    try {
      const userId = session.user!.name
      const { imdbid, title, year, poster } = req.body

      const foundUser = await User.findById(userId)

      if (!foundUser) {
        res.status(404).json({ success: false, msg: 'user not found' })
        return
      }

      if (foundUser.watched.includes(imdbid)) {
        res.status(400).json({ success: false, msg: 'imdbid already in watched' })
        return
      }

      if (foundUser.watchlist.includes(imdbid)) {
        if (foundUser.watchlist.length === 1) {
          foundUser.watchlist = []
        } else {
          foundUser.watchlist = foundUser.watchlist.filter((id: string) => id !== imdbid)
        }
      }

      foundUser.watched.push(imdbid)

      await foundUser.save()

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

      res.status(201).json({ success: true, msg: 'Added to Watched' })
    } catch (error) {
      res.status(500).json({ success: false, msg: 'something went wrong' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { imdbid } = req.body
      const userId = session.user!.name

      const foundUser = await User.findById(userId)

      if (!foundUser) console.log('not found user watched.ts')

      if (!foundUser.watched.includes(imdbid)) {
        res.status(400).json({ success: false, msg: 'no such id in watched, try again maybe' })
        return
      }
      if (foundUser.watched.length === 1) {
        foundUser.watched = []
        await foundUser.save()
        res.status(201).json({ success: true, msg: 'Removed from Watched' })
        return
      }
      foundUser.watched = foundUser.watched.filter((id: string) => id !== imdbid)

      await foundUser.save()
      res.status(201).json({ success: true, msg: 'Removed from Watched' })
    } catch (error) {
      res.status(500).json({ success: false, msg: 'something went wrong' })
    }
  } else {
    res.status(400).json({ success: false, msg: 'method not supported' })
  }
}

export default dbConnectAPI(handler)
