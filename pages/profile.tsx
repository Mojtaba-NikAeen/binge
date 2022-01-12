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

  console.log(fWatched)

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace('/')
  })
  const { data, error, mutate } = useSWR<DataSWR>('/api/user/', fetcher)

  if (status === 'loading') {
    return <></>
  }

  if (error) return <p className='center'>Failed to Load</p>
  if (!data) return <p className='center'>Loading...</p>

  const clearFeedback = () => setTimeout(() => setFeedback(undefined), 2000)

  const clearInput = () => ((document.getElementById('searchinput') as HTMLInputElement).value = '')

  const refreshOrder = () =>
    ((document.getElementById('orderSelect') as HTMLSelectElement).value = 'asc')

  const refreshSort = () =>
    ((document.getElementById('sortSelect') as HTMLSelectElement).value = 'date')

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

  const sortHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    if (fWatched) {
      switch (event.target.value) {
        case 'date':
          setFWatched(prevState =>
            data.data.watchedV.filter(({ imdbid: di }) =>
              [...prevState!].some(({ imdbid: si }) => di === si)
            )
          )
          setFWatchlist(prevState =>
            data.data.watchlistV.filter(({ imdbid: di }) =>
              [...prevState!].some(({ imdbid: si }) => di === si)
            )
          )
          refreshOrder()
          break
        case 'year':
          setFWatched(prevState => [...prevState!].sort((a, b) => a.year - b.year))
          setFWatchlist(prevState => [...prevState!].sort((a, b) => a.year - b.year))
          refreshOrder()
          break
        case 'alphabet':
          setFWatched(prevState => [...prevState!].sort((a, b) => (a.title > b.title ? 1 : 0)))
          setFWatchlist(prevState => [...prevState!].sort((a, b) => (a.title > b.title ? 1 : 0)))
          refreshOrder()
          break
        default:
          break
      }
    } else {
      switch (event.target.value) {
        case 'date':
          setFWatched(data.data.watchedV)
          setFWatchlist(data.data.watchlistV)
          refreshOrder()
          break
        case 'year':
          setFWatched([...data.data.watchedV].sort((a, b) => a.year - b.year))
          setFWatchlist([...data.data.watchlistV].sort((a, b) => a.year - b.year))
          refreshOrder()
          break
        case 'alphabet':
          setFWatched([...data.data.watchedV].sort((a, b) => (a.title > b.title ? 1 : 0)))
          setFWatchlist([...data.data.watchlistV].sort((a, b) => (a.title > b.title ? 1 : 0)))
          refreshOrder()
          break
        default:
          break
      }
    }
  }

  const orderHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    if (fWatched) {
      setFWatched(prevState => [...prevState!].reverse())
      setFWatchlist(prevState => [...prevState!].reverse())
    } else {
      if (event.target.value === 'asc') {
        setFWatched(data.data.watchedV)
        setFWatchlist(data.data.watchlistV)
      } else if (event.target.value === 'desc') {
        setFWatched([...data.data.watchedV].reverse())
        setFWatchlist([...data.data.watchlistV].reverse())
      }
    }
  }

  const SearchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const foundWatched = data.data.watchedV.filter(m =>
      m.title.toUpperCase().includes(event.target.value.toUpperCase())
    )
    const foundWatchlist = data.data.watchlistV.filter(m =>
      m.title.toUpperCase().includes(event.target.value.toUpperCase())
    )

    refreshOrder()
    refreshSort()
    setFWatched(foundWatched)
    setFWatchlist(foundWatchlist)
  }

  return (
    <div className='container card rounded bg-light mt-3'>
      <h2 className='lead mt-2'>Email: {session?.user?.email}</h2>
      <hr />

      <div className='input-group w-50 center divProfile'>
        <input
          id='searchinput'
          type='text'
          className='form-control inputProfile'
          placeholder='Search in your list'
          style={{ width: '50%' }}
          onChange={SearchHandler}
        />

        <select
          id='sortSelect'
          className='form-select searchProfile'
          defaultValue='date'
          style={{ width: '25%' }}
          onChange={sortHandler}
        >
          <option value='date'>Date</option>
          <option value='year'>Year</option>
          <option value='alphabet'>A-Z</option>
        </select>

        <select
          id='orderSelect'
          className='form-select searchProfile'
          defaultValue='asc'
          style={{ width: '25%' }}
          onChange={orderHandler}
        >
          <option value='asc'>Asc</option>
          <option value='desc'>Desc</option>
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
