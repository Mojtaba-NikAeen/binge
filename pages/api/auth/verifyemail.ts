import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { dbConnectAPI } from '../../../libs/dbconnect'
import User from '../../../models/user'
import sendMail from '../../../libs/sendMail'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, msg: 'method not supported' })
  }

  if (req.method === 'GET') {
    try {
      const { token } = req.query

      const user = await User.findOne({
        verifyToken: token,
        verifyTokenExpire: { $gt: Date.now() }
      })

      if (!user) {
        return res.status(400).json({ success: false, msg: 'invalid token' })
      }

      user.verifyToken = ''

      if (user.verified) {
        await user.save()
        res.status(400).json({ success: false, msg: 'invalid token' })
        return
      }

      user.verified = true
      await user.save()

      return res.status(200).json({ success: true, msg: 'Your account has been activated' })
    } catch (error) {
      res.status(500).json({ success: false, msg: 'Server error' })
      return
    }
  } else if (req.method === 'POST') {
    try {
      const { email } = req.body

      const user = await User.findOne({
        email,
        verifyTokenExpire: { $lt: Date.now() - 15 * 60 * 1000 }
      })

      if (!user) {
        return res.status(400).json({ success: false, msg: 'invalid request, wait 15 minutes' })
      }

      const token = crypto.randomBytes(22).toString('hex')
      user.verifyToken = token
      user.verifyTokenExpire = Date.now() + 15 * 60 * 1000
      await user.save()

      await sendMail({ to: email, secret: token })

      return res.status(201).json({ success: true, msg: 'Email was sent' })
    } catch (error: any) {
      console.log(error.message || 'internal server error post method verify email')
      res.status(500).json({ success: false, msg: 'Server error' })
      return
    }
  }
}

export default dbConnectAPI(handler)
