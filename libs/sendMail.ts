import nodemailer from 'nodemailer'

interface Options {
  to: string
  secret: string
}

const sendMail = async (options: Options) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    })

    let info = await transporter.sendMail({
      from: '"BingedThat" <something@something.com>',
      to: options.to,
      subject: 'Email Verification',
      text: `click on this link and if it's successful, it will redirect you to the login page ${process.env.SERVER_URL}/api/auth/verifyemail?token=${options.secret}`
    })

    console.log('Message sent: %s', info.messageId)
  } catch (error: any) {
    console.log(error.message || 'email not sent')
  }
}

export default sendMail
