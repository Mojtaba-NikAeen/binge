import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnectAPI } from '../../../libs/dbconnect'
import { hash } from 'bcryptjs'
import crypto from 'crypto'
import User from '../../../models/user'
import sendMail from '../../../libs/sendMail'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(422).json({ success: false, msg: 'method not supported' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, msg: 'incomplete data' })
  }

  try {
    const foundEmail = await User.findOne({ email })
    if (foundEmail) {
      return res.status(400).json({ success: false, msg: 'already a user with this email' })
    }

    const hashedPassword = await hash(password, 12)

    const user = new User({
      email: email,
      password: hashedPassword
    })

    const token = crypto.randomBytes(22).toString('hex')
    user.verifyToken = token
    user.verifyTokenExpire = Date.now() + 15 * 60 * 1000
    const data = await user.save()

    await sendMail({ to: email, secret: token })

    return res.status(201).json({ success: true, data: data })
  } catch (error: any) {
    console.log(error.message || error)
    return res.status(500).json({ success: false, msg: error.message || 'something went wrong' })
  }
}

export default dbConnectAPI(handler)
