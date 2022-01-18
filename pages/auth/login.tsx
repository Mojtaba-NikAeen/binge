import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Auth from '../../components/auth'

const LoginPage = () => {
  return <Auth login />
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export default LoginPage
