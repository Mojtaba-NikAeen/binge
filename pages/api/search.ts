import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { ResponseData, SearchResult } from '../../interfaces'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ success: false, msg: 'not authorized to use this route' })
  }
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, msg: 'method not supported' })
    return
  }
  const response = await fetch(
    `https://www.omdbapi.com/?s=${req.query.name}&page=${req.query.page}&type=movie&apikey=${process.env.API_KEY}`
  )
  const results: SearchResult = await response.json()

  if (results.Response === 'False') {
    res.status(404).json({ success: false, msg: 'Movie not found' })
    return
  }

  res.status(200).json({ success: true, data: results, msg: 'wtf' })
}

export default handler
