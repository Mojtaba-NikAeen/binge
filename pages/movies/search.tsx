import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Search from '../../components/search'

const SearchPage = () => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace('/')
  })

  if (status === 'loading') {
    return <></>
  }

  return (
    <main className='container bg-light mt-5 pb-5 rounded'>
      <h1 className='text-center'>Search Movies</h1>
      <Search />
    </main>
  )
}

export default SearchPage
