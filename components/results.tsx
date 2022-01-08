import Image from 'next/image'
import Link from 'next/link'
import classes from './results.module.css'
import { SearchResult } from '../interfaces'
import { memo } from 'react'

const Results = ({ items }: { items: SearchResult | undefined }) => {
  if (!items || items.Error) {
    return <p>{items?.Error}</p> || <p>nothing was found</p>
  }

  const addToWatchedHandler = async (
    imdbid: string,
    title: string,
    year: string,
    poster: string
  ) => {
    try {
      const res = await fetch('/api/movies/watched', {
        method: 'PATCH',
        body: JSON.stringify({ imdbid, title, year, poster }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()

      const btn = document.getElementById(imdbid) as HTMLButtonElement
      btn.disabled = true

      btn.textContent = 'Added'
      console.log(data)
    } catch (error: any) {
      const btn = document.getElementById(imdbid) as HTMLButtonElement
      btn.disabled = true
      btn.textContent = 'Failed, Try Again'

      setTimeout(() => {
        btn.disabled = false
        btn.textContent = 'Add to Watched'
      }, 3000)

      console.log(error.message || 'it all went wrong')
    }
  }

  const addToWatchlistHandler = async (
    imdbid: string,
    title: string,
    year: string,
    poster: string
  ) => {
    try {
      const res = await fetch('/api/movies/watchlist', {
        method: 'PATCH',
        body: JSON.stringify({ imdbid, title, year, poster }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()

      const btn = document.getElementById(`watchlist${imdbid}`) as HTMLButtonElement
      btn.disabled = true
      btn.textContent = 'Added'

      console.log(data)
    } catch (error: any) {
      const btn = document.getElementById(`watchlist${imdbid}`) as HTMLButtonElement
      btn.disabled = true
      btn.textContent = 'Failed, Try Again'

      setTimeout(() => {
        btn.disabled = false
        btn.textContent = 'Add to Watchlist'
      }, 3000)

      console.log(error.message || 'it all went wrong')
    }
  }

  return (
    <>
      {items.Search.map(item => (
        <div className='card mb-3 mt-3' key={`${item.imdbID}${Math.ceil(Math.random() * 10000)}`}>
          <div className='row g-0'>
            <div className={`col-md-4 ${classes.image}`}>
              <Image
                src={item.Poster !== 'N/A' ? item.Poster : '/placeholder.png'}
                alt={`${item.Title} poster`}
                width={431}
                height={250}
                quality={80}
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
                    id={item.imdbID}
                    className='btn btn-outline-success'
                    onClick={() =>
                      addToWatchedHandler(item.imdbID, item.Title, item.Year, item.Poster)
                    }
                  >
                    Add to Watched
                  </button>
                  <button
                    className='btn btn-outline-warning'
                    onClick={() =>
                      addToWatchlistHandler(item.imdbID, item.Title, item.Year, item.Poster)
                    }
                    id={`watchlist${item.imdbID}`}
                  >
                    Add to Watchlist
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