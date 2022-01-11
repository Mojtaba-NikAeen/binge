import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import useSWR from 'swr'
import Feedback from '../components/feedback'
import List from '../components/list'
import { DataSWR, Watch } from '../interfaces'

interface Feedback {
  message: string
  status: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const ProfilePage = () => {
  const [feedback, setFeedback] = useState<Feedback>()
  const [fWatched, setFWatched] = useState<Watch[] | null>(null)
  const [fWatchlist, setFWatchlist] = useState<Watch[] | null>(null)
  const router = useRouter()

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace('/')
  })
  const { data, error, mutate } = useSWR<DataSWR>('/api/user/', fetcher)

  if (status === 'loading') {
    return <></>
  }

  if (error) return <p className='center'>failed to load</p>
  if (!data) return <p className='center'>Loading...</p>

  const clearFeedback = () => setTimeout(() => setFeedback(undefined), 2000)

  const clearInput = () => ((document.getElementById('searchinput') as HTMLInputElement).value = '')

  const addFn = async (imdbid: string) => {
    try {
      setFeedback({ message: 'Sending Your Request', status: 'info' })
      const res = await fetch('/api/movies/watched', {
        method: 'PATCH',
        body: JSON.stringify({ imdbid }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()
      setFWatched(null)
      setFWatchlist(null)
      mutate()
      setFeedback({ message: data.msg, status: 'success' })
      clearFeedback()
      clearInput()
    } catch (error: any) {
      console.log(error.message || 'something went wrong')
    }
  }

  const removeMovie = async (name: string, imdbid: string) => {
    if (name === 'watchlist') {
      try {
        setFeedback({ message: 'Sending Your Request', status: 'info' })
        const res = await fetch('/api/movies/watchlist', {
          method: 'DELETE',
          body: JSON.stringify({ imdbid }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = await res.json()
        setFeedback({ message: data.msg, status: 'success' })
        clearFeedback()
        clearInput()
        setFWatched(null)
        setFWatchlist(null)
        mutate()
      } catch (error: any) {
        setFeedback({ message: 'Something Went Wrong', status: 'danger' })
        clearFeedback()
        console.log(error.message || 'something went wrong')
      }
    } else if (name === 'watched') {
      try {
        setFeedback({ message: 'Sending Your Request', status: 'info' })
        const res = await fetch('/api/movies/watched', {
          method: 'DELETE',
          body: JSON.stringify({ imdbid }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = await res.json()
        setFWatched(null)
        setFWatchlist(null)
        clearInput()
        mutate()
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

  const sortHandler = () => {}

  const orderHandler = () => {}

  const SearchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const foundWatched = data.data.watchedV.filter(m =>
      m.title.toUpperCase().includes(event.target.value.toUpperCase())
    )
    const foundWatchlist = data.data.watchlistV.filter(m =>
      m.title.toUpperCase().includes(event.target.value.toUpperCase())
    )

    setFWatched(foundWatched)
    setFWatchlist(foundWatchlist)
  }

  return (
    <div className='container card rounded bg-light mt-3'>
      <h2 className='lead mt-2'>Email: {session?.user?.email}</h2>
      <hr />

      <div className='input-group w-50 center'>
        <input
          id='searchinput'
          type='text'
          className='form-control'
          placeholder='Search in your list'
          style={{ width: '50%' }}
          onChange={SearchHandler}
        />

        <select className='form-select' style={{ width: '25%' }} onChange={sortHandler}>
          <option selected disabled>
            Sort By
          </option>
          <option value='year'>Year</option>
          <option value='alphabet'>Alphabet</option>
          <option value='date'>Date of Added</option>
        </select>

        <select className='form-select' style={{ width: '25%' }} onChange={orderHandler}>
          <option value='asc' selected>
            Ascending
          </option>
          <option value='desc'>Descending</option>
        </select>
      </div>

      <hr />
      <div className='container'>
        {feedback && <Feedback message={feedback.message} status={feedback.status} />}
        <h3>Watched</h3>
        {data.data.watchedV.length === 0 && <p className='center fs-2 lead'>Nothing yet</p>}
        <List data={fWatched || data.data.watchedV} watchlist={false} removeFn={removeMovie} />
      </div>
      <hr />
      <div className='container'>
        <h3>Watchlist</h3>
        {data.data.watchlistV.length === 0 && <p className='center fs-2 lead mb-3'>Nothing yet</p>}
        <List
          data={fWatchlist || data.data.watchlistV}
          watchlist
          removeFn={removeMovie}
          addWatched={addFn}
        />
      </div>
    </div>
  )
}

export default ProfilePage
