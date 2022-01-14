import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { YIFYResult } from '../../interfaces'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ success: false, msg: 'not authorized to use this route' })
  }

  if (req.method !== 'POST') return res.status(400).json({ msg: 'method not supported' })
  try {
    const { imdbid } = req.body

    const response = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${imdbid}`)
    const data: YIFYResult = await response.json()
    if (data.data.movie_count > 0) {
      res.status(200).json({ data: data.data.movies[0].torrents, success: true, msg: 'alright' })
      return
    } else {
      res.status(404).json({
        success: false,
        msg: 'No torrent was found for this movie'
      })
      return
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Internal error' })
    return
  }
}

export default handler
