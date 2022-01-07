import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Home = () => {
  const { status } = useSession()

  if (status === 'loading') {
    return <p className='center fs-2'>loading...</p>
  }

  const btn =
    status === 'authenticated' ? (
      <Link href={'/movies/search'}>
        <a className='btn btn-lg btn-success mx-auto' style={{ display: 'block', width: '20%' }}>
          Search for Movies
        </a>
      </Link>
    ) : (
      <Link href={'/auth/signup'}>
        <a className='btn btn-lg btn-success mx-auto' style={{ display: 'block', width: '20%' }}>
          Sign-up
        </a>
      </Link>
    )

  return (
    <div>
      <main className='container bg-light mt-5 pb-5 rounded'>
        <h1 className='text-center p-2'>Been There, Binged That</h1>
        <p className='m-5 lead'>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed dolorum amet quidem libero
          deserunt fugiat provident consectetur maiores repellat laboriosam odio fugit asperiores,
          totam corporis pariatur voluptate deleniti molestias laborum.
        </p>
        {btn}
      </main>
    </div>
  )
}

export default Home
