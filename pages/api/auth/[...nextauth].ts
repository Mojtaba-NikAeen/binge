import { compare } from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { dbConnect } from '../../../libs/dbconnect'
import User from '../../../models/user'

export default NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email', label: 'E-Mail', placeholder: 'email' },
        password: {
          type: 'password',
          label: 'Password'
        }
      },
      authorize: async credentials => {
        await dbConnect()
        const foundUser = await User.findOne({ email: credentials!.email })
        if (!foundUser) {
          throw new Error('wrong credentials')
        }

        const isPassValid = await compare(credentials!.password, foundUser.password)
        if (!isPassValid) {
          throw new Error('wrong credentials')
        }

        return {
          name: foundUser.id,
          email: foundUser.email,
          image: { watched: foundUser.watched, watchlist: foundUser.watchlist }
        }
      }
    })
  ],
  secret: 'somethingfuckingthing',
  jwt: {
    secret: 'jwtsecretveryhushhush'
  },
  session: {
    maxAge: 7 * 24 * 60 * 60
  },
  pages: {
    signIn: '/auth/login'
  }
})
