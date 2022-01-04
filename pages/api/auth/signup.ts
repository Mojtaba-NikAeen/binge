import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnectAPI } from '../../../libs/dbconnect'
import { hash } from 'bcryptjs'
import User from '../../../models/user'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(422).json({ success: false, msg: 'method not supported' })
  }

  // check if email & password is provided
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, msg: 'incomplete data' })
  }

  try {
    // checking if email exists already
    const foundEmail = await User.findOne({ email })
    if (foundEmail) {
      return res.status(400).json({ success: false, msg: 'already a user with this email' })
    }
    // hashing the password
    const hashedPassword = await hash(password, 12)

    const user = new User({
      email: email,
      password: hashedPassword
    })

    const data = await user.save()

    return res.status(201).json({ success: true, data: data })
  } catch (error: any) {
    console.log(error.message || error)
    return res.status(500).json({ success: false, msg: error.message || 'something went wrong' })
  }
}

export default dbConnectAPI(handler)
