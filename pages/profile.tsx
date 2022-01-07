import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import Feedback from '../components/feedback'
import List from '../components/list'
import { DataSWR } from '../interfaces'

interface Feedback {
  message: string
  status: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const ProfilePage = () => {
  const [feedback, setFeedback] = useState<Feedback>()
  const router = useRouter()

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace('/')
  })
  const { data, error, mutate } = useSWR<DataSWR>('/api/user/', fetcher)

  if (status === 'loading') {
    return <></>
  }

  if (error) return <p>failed to load</p>
  if (!data) return <p>loading</p>

  const clearFeedback = () => setTimeout(() => setFeedback(undefined), 2000)

  const addFn = async (imdbid: string) => {
    try {
      setFeedback({ message: 'sending your request', status: 'info' })
      const res = await fetch('/api/movies/watched', {
        method: 'PATCH',
        body: JSON.stringify({ imdbid }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()
      mutate()
      setFeedback({ message: data.msg, status: 'success' })
      clearFeedback()
      console.log(data)
    } catch (error: any) {
      console.log(error.message || 'something went wrong')
    }
  }

  const removeMovie = async (name: string, imdbid: string) => {
    if (name === 'watchlist') {
      try {
        setFeedback({ message: 'sending your request', status: 'info' })
        const res = await fetch('/api/movies/watchlist', {
          method: 'DELETE',
          body: JSON.stringify({ imdbid }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = await res.json()
        console.log(data)
        setFeedback({ message: data.msg, status: 'success' })
        clearFeedback()
        mutate()
      } catch (error: any) {
        setFeedback({ message: 'Something Went Wrong', status: 'danger' })
        clearFeedback()
        console.log(error.message || 'something went wrong')
      }
    } else if (name === 'watched') {
      try {
        setFeedback({ message: 'sending your request', status: 'info' })
        const res = await fetch('/api/movies/watched', {
          method: 'DELETE',
          body: JSON.stringify({ imdbid }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = await res.json()
        mutate()
        console.log(data)
        setFeedback({ message: data.msg, status: 'success' })
        clearFeedback()
      } catch (error: any) {
        setFeedback({ message: 'Something Went Wrong', status: 'danger' })
        clearFeedback()
        console.log(error.message || 'something went wrong')
      }
    }
    return
  }

  return (
    <div className='container card rounded bg-light mt-3'>
      <h2 className='lead mt-2'>Email: {session?.user?.email}</h2>
      <hr />
      <div className='container'>
        {feedback && <Feedback message={feedback.message} status={feedback.status} />}
        <h3>Watched</h3>
        {data.data.watchedV.length === 0 && <p className='center fs-2 lead'>Nothing yet</p>}
        <List data={data.data.watchedV} watchlist={false} removeFn={removeMovie} />
      </div>
      <hr />
      <div className='container'>
        <h3>Watchlist</h3>
        {data.data.watchlistV.length === 0 && <p className='center fs-2 lead mb-3'>Nothing yet</p>}
        <List data={data.data.watchlistV} watchlist removeFn={removeMovie} addWatched={addFn} />
      </div>
    </div>
  )
}

export default ProfilePage
