import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import Search from '../components/search'

const Home = () => {
  const { status } = useSession()

  return (
    <div>
      <main className='container bg-light mt-5 pb-5 rounded-3'>
        <h1 className='text-center p-2'>Been There, Binged That</h1>
        <p className='m-5 lead'>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed dolorum amet quidem libero
          deserunt fugiat provident consectetur maiores repellat laboriosam odio fugit asperiores,
          totam corporis pariatur voluptate deleniti molestias laborum.
        </p>
        {status === 'unauthenticated' && (
          <div className='btn-group btn-group-lg center d-block'>
            <Link href={'/auth/login'}>
              <a className='btn btn-success buttonSize'>Login</a>
            </Link>
            <Link href={'/auth/signup'}>
              <a className='btn btn-warning buttonSize'>Sign-up</a>
            </Link>
          </div>
        )}
      </main>
      {status === 'authenticated' && (
        <main className='container bg-light mt-4 pb-5 rounded-3'>
          <h1 className='text-center'>Search for Movies</h1>
          <Search />
        </main>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: { session: await getSession(context) }
  }
}

export default Home
