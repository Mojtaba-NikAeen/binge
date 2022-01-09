import nodemailer from 'nodemailer'

interface Options {
  to: string
  secret: string
}

const sendMail = async (options: Options) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL, // generated ethereal user
        pass: process.env.SMTP_PASSWORD // generated ethereal password
      }
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"BingedThat" <something@something.com>', // sender address
      to: options.to, // list of receivers
      subject: 'Email Verification', // Subject line
      text: `click on this link to verify your email ${process.env.SERVER_URL}/api/auth/verifyemail?token=${options.secret}` // plain text body
    })

    console.log('Message sent: %s', info.messageId)
  } catch (error: any) {
    console.log(error.message || 'email not sent')
  }
}

export default sendMail
