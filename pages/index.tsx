import type { NextPage } from 'next'
import Head from 'next/head'
import Search from '../components/search'

const Home: NextPage = () => {
  return (
    <div>
      <main className='container bg-light mt-5 pb-5'>
        <h1 className='text-center'>Search movies</h1>
        <Search />
      </main>
    </div>
  )
}

export default Home
