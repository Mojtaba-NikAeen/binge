import Image from 'next/image'
import Link from 'next/link'
import classes from './results.module.css'
import { UserQuery, SearchResult } from '../interfaces'
import { memo, useState } from 'react'
import { fetchUser, addToWatched, queryClient, addToWatchlist } from '../libs/reactQuery'
import { useMutation, useQuery } from 'react-query'

const Results = ({ items }: { items: SearchResult | undefined }) => {
  const [lists, setLists] = useState<any>()

  useQuery<UserQuery>('user', fetchUser, {
    onSuccess: data => setLists({ watched: data.data.watched, watchlist: data.data.watchlist })
  })

  // TODO handle them errors
  const addToWatchedMutation = useMutation(addToWatched, {
    onSuccess: () => queryClient.invalidateQueries('user'),
    onError: () => console.log('error addtowatched')
  })

  const addToWatchlistMutation = useMutation(addToWatchlist, {
    onSuccess: () => queryClient.invalidateQueries('user'),
    onError: () => console.log('error addtowatchlist')
  })

  if (!items || items.Error) {
    return <p>{items?.Error}</p> || <p>nothing was found</p>
  }

  return (
    <>
      {items.Search.map(item => (
        <div
          className='card w-75 mx-auto my-3 border border-danger'
          key={`${item.imdbID}${Math.ceil(Math.random() * 10000)}`}
        >
          <div className='row g-0'>
            <div className={`col-md-4 ${classes.image}`}>
              <Image
                src={item.Poster !== 'N/A' ? item.Poster : '/placeholder.png'}
                alt={`${item.Title} poster`}
                width={431}
                height={250}
                unoptimized
              />
            </div>
            <div className='col-md-8'>
              <div className='card-body'>
                <h5 className='card-title'>{item.Title}</h5>
                <p>
                  <small className='text-muted'>Year: {item.Year}</small>
                </p>
                <div className='btn-group'>
                  <Link href={`/movies/${item.imdbID}`}>
                    <a className='btn btn-outline-info'>More Details</a>
                  </Link>

                  <button
                    className={`btn ${
                      lists.watched.includes(item.imdbID) ? 'btn-success' : 'btn-outline-success'
                    }`}
                    disabled={lists.watched.includes(item.imdbID)}
                    onClick={() =>
                      addToWatchedMutation.mutate({
                        imdbid: item.imdbID,
                        title: item.Title,
                        year: item.Year,
                        poster: item.Poster
                      })
                    }
                  >
                    {lists.watched.includes(item.imdbID) ? 'Watched' : 'Add to Watched'}
                  </button>
                  <button
                    className={`btn ${
                      lists.watchlist.includes(item.imdbID) ? 'btn-warning' : 'btn-outline-warning'
                    }`}
                    disabled={
                      lists.watchlist.includes(item.imdbID) || lists.watched.includes(item.imdbID)
                    }
                    onClick={() =>
                      addToWatchlistMutation.mutate({
                        imdbid: item.imdbID,
                        title: item.Title,
                        year: item.Year,
                        poster: item.Poster
                      })
                    }
                  >
                    {lists.watchlist.includes(item.imdbID) ? 'In Watchlist' : 'Add to Watchlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

const memoizedResults = memo(Results)

export default memoizedResults
