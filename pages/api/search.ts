import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData, SearchResult } from '../../interfaces'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, msg: 'method not supported' })
    return
  }
  const response = await fetch(
    `https://www.omdbapi.com/?s=${req.query.name}&y=${req.query.year}&type=movie&apikey=${process.env.API_KEY}`
  )
  const results: SearchResult = await response.json()

  res.status(200).json({ success: true, data: results })
}

export default handler
