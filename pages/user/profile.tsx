import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import { useQuery } from 'react-query'
import Feedback from '../../components/feedback'
import List from '../../components/list'
import { DataSWR, Watch } from '../../interfaces'
import { fetchUser } from '../../libs/reactQuery'

interface Feedback {
  message: string
  status: string
}

const splitData = (array: any[], part: number, number: number) =>
  array ? array.slice(0, part * number) : undefined

const clearInput = () => {
  const searchInput = document.getElementById('searchinput') as HTMLInputElement
  searchInput ? (searchInput.value = '') : null
}

const refreshOrder = () => {
  const orderSelect = document.getElementById('orderSelect') as HTMLSelectElement
  orderSelect ? (orderSelect.value = 'asc') : null
}

const refreshSort = () => {
  const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement
  sortSelect ? (sortSelect.value = 'date') : null
}

const ProfilePage = () => {
  const [watchedPage, setWatchedPage] = useState({ pageNumber: 1, totalPage: 0, totalResults: 0 })
  const [watchlistPage, setWatchlistPage] = useState({
    pageNumber: 1,
    totalPage: 0,
    totalResults: 0
  })

  const [fWatched, setFWatched] = useState<Watch[] | undefined>(undefined)
  const [fWatchlist, setFWatchlist] = useState<Watch[] | undefined>(undefined)

  const [showList, setShowList] = useState<string>('both')
  const [reqType, setReqType] = useState<string | undefined>()
  const [feedback, setFeedback] = useState<Feedback>()

  const router = useRouter()

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace('/')
  })

  const { data, error, refetch } = useQuery<DataSWR>('user', fetchUser, {
    onSuccess: data => {
      if (fWatched && reqType === 'remove') {
        setFWatched(ps =>
          ps!.filter(({ imdbid: di }) =>
            [...data.data.watchedV].some(({ imdbid: si }) => di === si)
          )
        )

        setFWatchlist(ps =>
          ps!.filter(({ imdbid: di }) =>
            [...data.data.watchlistV].some(({ imdbid: si }) => di === si)
          )
        )
        setReqType(undefined)

        return
      }

      setWatchedPage({
        pageNumber: 1,
        totalResults: data.data.watchedV.length,
        totalPage: Math.ceil(data.data.watchedV.length / 4)
      })
      setWatchlistPage({
        pageNumber: 1,
        totalResults: data.data.watchlistV.length,
        totalPage: Math.ceil(data.data.watchlistV.length / 4)
      })
      setFWatched(data.data.watchedV)
      setFWatchlist(data.data.watchlistV)

      refreshOrder()
      refreshSort()
      clearInput()
    }
  })

  if (status === 'loading') return <></>

  if (error) return <p className='center'>Failed to Load</p>
  if (!data) return <p className='center'>Loading...</p>

  const clearFeedback = () => setTimeout(() => setFeedback(undefined), 2000)

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
      setFeedback({ message: data.msg, status: 'success' })
      clearFeedback()

      setWatchlistPage(ps => ({
        pageNumber:
          ps.pageNumber > Math.ceil((ps.totalResults - 1) / 4) ? ps.pageNumber - 1 : ps.pageNumber,
        totalResults: ps.totalResults - 1,
        totalPage: Math.ceil((ps.totalResults - 1) / 4)
      }))

      setWatchedPage(ps => ({
        pageNumber:
          ps.pageNumber > Math.ceil((ps.totalResults + 1) / 4) ? ps.pageNumber - 1 : ps.pageNumber,
        totalResults: ps.totalResults + 1,
        totalPage: Math.ceil((ps.totalResults + 1) / 4)
      }))
      refetch()
      clearInput()
    } catch (error: any) {
      setFeedback({ message: 'Something Went Wrong', status: 'danger' })
      clearFeedback()
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
        setWatchlistPage(ps => ({
          pageNumber:
            ps.pageNumber > Math.ceil((ps.totalResults - 1) / 4)
              ? ps.pageNumber - 1
              : ps.pageNumber,
          totalResults: ps.totalResults - 1,
          totalPage:
            Math.floor((ps.totalResults - 1) / 4) === 0 ? 1 : Math.floor((ps.totalResults - 1) / 4)
        }))
        setReqType('remove')
        refetch()
      } catch (error: any) {
        setFeedback({ message: 'Something Went Wrong', status: 'danger' })
        clearFeedback()
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
        setFeedback({ message: data.msg, status: 'success' })
        clearFeedback()

        setWatchedPage(ps => ({
          pageNumber:
            ps.pageNumber > Math.ceil((ps.totalResults - 1) / 4)
              ? ps.pageNumber - 1
              : ps.pageNumber,
          totalResults: ps.totalResults - 1,
          totalPage:
            Math.floor((ps.totalResults - 1) / 4) === 0 ? 1 : Math.floor((ps.totalResults - 1) / 4)
        }))

        setReqType('remove')
        refetch()
      } catch (error: any) {
        setFeedback({ message: 'Something Went Wrong', status: 'danger' })
        clearFeedback()
      }
    }
    return
  }

  const sortHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    switch (event.target.value) {
      case 'date':
        fWatched!.length < 2 ||
          setFWatched(ps =>
            data.data.watchedV.filter(({ imdbid: di }) =>
              [...ps!].some(({ imdbid: si }) => di === si)
            )
          )
        fWatchlist!.length < 2 ||
          setFWatchlist(ps =>
            data.data.watchlistV.filter(({ imdbid: di }) =>
              [...ps!].some(({ imdbid: si }) => di === si)
            )
          )
        refreshOrder()
        break
      case 'year':
        fWatched!.length < 2 || setFWatched(ps => [...ps!].sort((a, b) => a.year - b.year))
        fWatchlist!.length < 2 || setFWatchlist(ps => [...ps!].sort((a, b) => a.year - b.year))
        refreshOrder()
        break
      case 'alphabet':
        fWatched!.length < 2 ||
          setFWatched(ps => [...ps!].sort((a, b) => (a.title > b.title ? 1 : 0)))
        fWatchlist!.length < 2 ||
          setFWatchlist(ps => [...ps!].sort((a, b) => (a.title > b.title ? 1 : 0)))
        refreshOrder()
        break
      default:
        break
    }
  }

  const orderHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setFWatched(ps => [...ps!].reverse())
    setFWatchlist(ps => [...ps!].reverse())
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
    setWatchedPage({
      pageNumber: 1,
      totalResults: foundWatched.length,
      totalPage: Math.ceil(foundWatched.length / 4)
    })
    setWatchlistPage({
      pageNumber: 1,
      totalResults: foundWatchlist.length,
      totalPage: Math.ceil(foundWatchlist.length / 4)
    })
    setFWatched(foundWatched)
    setFWatchlist(foundWatchlist)
  }

  const watched = (
    <>
      <h3>Watched</h3>
      {fWatched && fWatched.length === 0 && <p className='center fs-3 lead'>Nothing</p>}
      <List
        data={splitData(fWatched!, 4, watchedPage.pageNumber) || data.data.watchedV}
        watchlist={false}
        removeFn={removeMovie}
      />

      {watchedPage.totalPage === 1 ||
        fWatched?.length === 0 ||
        (!(watchedPage.pageNumber === watchedPage.totalPage) ? (
          <div className='btn-group w-100'>
            <button
              className='btn btn-outline-primary w-50 mb-2'
              onClick={() => {
                setWatchedPage(ps => ({ ...ps, pageNumber: ps.pageNumber + 1 }))
              }}
            >
              Load More
            </button>
            {watchedPage.pageNumber > 1 && (
              <button
                className='btn btn-outline-info w-50 mb-2'
                onClick={() => {
                  setWatchedPage(ps => ({ ...ps, pageNumber: ps.pageNumber - 1 }))
                }}
              >
                Less
              </button>
            )}
          </div>
        ) : (
          <div className='btn-group w-100'>
            <button
              className='btn btn-outline-danger w-50 mb-2'
              onClick={() => {
                setWatchedPage(ps => ({ ...ps, pageNumber: 1 }))
              }}
            >
              Close
            </button>
            <button
              className='btn btn-outline-info w-50 mb-2'
              onClick={() => {
                setWatchedPage(ps => ({ ...ps, pageNumber: ps.pageNumber - 1 }))
              }}
            >
              Less
            </button>
          </div>
        ))}
    </>
  )

  const watchlist = (
    <>
      <h3>Watchlist</h3>
      {fWatchlist && fWatchlist.length === 0 && <p className='center fs-3 lead mb-3'>Nothing</p>}
      <List
        data={splitData(fWatchlist!, 4, watchlistPage.pageNumber) || data.data.watchlistV}
        watchlist
        removeFn={removeMovie}
        addWatched={addFn}
      />

      {watchlistPage.totalPage === 1 ||
        fWatchlist?.length === 0 ||
        (!(watchlistPage.pageNumber === watchlistPage.totalPage) ? (
          <div className='btn-group w-100'>
            <button
              className='btn btn-outline-primary w-50 mb-2'
              onClick={() => {
                setWatchlistPage(ps => ({ ...ps, pageNumber: ps.pageNumber + 1 }))
              }}
            >
              Load More
            </button>

            {watchlistPage.pageNumber > 1 && (
              <button
                className='btn btn-outline-info w-50 mb-2'
                onClick={() => {
                  setWatchlistPage(ps => ({ ...ps, pageNumber: ps.pageNumber - 1 }))
                }}
              >
                Less
              </button>
            )}
          </div>
        ) : (
          <div className='btn-group w-100'>
            <button
              className='btn btn-outline-danger w-50 mb-2'
              onClick={() => {
                setWatchlistPage(ps => ({ ...ps, pageNumber: 1 }))
              }}
            >
              Close
            </button>
            <button
              className='btn btn-outline-info w-50 mb-2'
              onClick={() => {
                setWatchlistPage(ps => ({ ...ps, pageNumber: ps.pageNumber - 1 }))
              }}
            >
              Less
            </button>
          </div>
        ))}
    </>
  )

  return (
    <div className='container card rounded bg-light mt-3 mb-4'>
      <h2 className='lead mt-2'>Email: {session!.user!.email}</h2>
      <hr />

      <div className='input-group center divProfile'>
        <input
          id='searchinput'
          type='text'
          className='form-control inputProfile'
          placeholder='Search in your list'
          style={{ width: '40%' }}
          onChange={SearchHandler}
        />

        <select
          id='sortSelect'
          className='form-select searchProfile'
          defaultValue='date'
          style={{ width: '18%' }}
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
          style={{ width: '20%' }}
          onChange={orderHandler}
        >
          <option value='asc'>Asc</option>
          <option value='desc'>Desc</option>
        </select>

        <select
          className='form-select searchProfile'
          style={{ width: '22%' }}
          defaultValue='both'
          onChange={e => setShowList(e.target.value)}
        >
          <option value='both'>Both</option>
          <option value='watched'>Watched</option>
          <option value='watchlist'>Watchlist</option>
        </select>
      </div>

      <hr />
      <div className='container'>
        {feedback && <Feedback message={feedback.message} status={feedback.status} />}

        {showList === 'both' && (
          <>
            {watched}
            <hr />
            {watchlist}
          </>
        )}

        {showList === 'watched' && watched}
        {showList === 'watchlist' && watchlist}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
}

export default ProfilePage
