import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <div id='feedback' />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
