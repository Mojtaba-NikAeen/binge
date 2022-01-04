import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>IMDb but Better</title>
        <meta name='description' content='search movies' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3'
          crossOrigin='anonymous'
        />

        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
