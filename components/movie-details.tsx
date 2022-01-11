import Image from 'next/image'
import { useEffect, useState } from 'react'
import { IDSearchResult } from '../interfaces'
import classes from './movie-details.module.css'

const MovieDetails = ({ results }: { results: IDSearchResult }) => {
  const [lists, setLists] = useState<any>()
  const [update, setUpdate] = useState<boolean>(false)

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setLists({ watched: data.data.watched, watchlist: data.data.watchlist }))
      .catch(err => console.log(err))
  }, [update])

  if (!lists) return <p className='center fs-1'>Loading...</p>

  const isInWatched = lists.watched.includes(results.imdbID)
  const isInWatchlist = lists.watchlist.includes(results.imdbID)

  const addToWatched = async () => {
    try {
      const res = await fetch('/api/movies/watched', {
        method: 'PATCH',
        body: JSON.stringify({
          imdbid: results.imdbID,
          title: results.Title,
          year: results.Year,
          poster: results.Poster
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      await res.json()
      setUpdate(ps => !ps)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const addToWatchlist = async () => {
    try {
      const res = await fetch('/api/movies/watchlist', {
        method: 'PATCH',
        body: JSON.stringify({
          imdbid: results.imdbID,
          title: results.Title,
          year: results.Year,
          poster: results.Poster
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      await res.json()
      setUpdate(ps => !ps)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const removeMovie = async () => {
    if (isInWatchlist) {
      try {
        const res = await fetch('/api/movies/watchlist', {
          method: 'DELETE',
          body: JSON.stringify({ imdbid: results.imdbID }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        await res.json()
        setUpdate(ps => !ps)
      } catch (error: any) {
        console.log(error.message || 'something went wrong')
      }
    } else if (isInWatched) {
      try {
        const res = await fetch('/api/movies/watched', {
          method: 'DELETE',
          body: JSON.stringify({ imdbid: results.imdbID }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        await res.json()
        setUpdate(ps => !ps)
      } catch (error: any) {
        console.log(error.message || 'something went wrong')
      }
    }
    return
  }

  return (
    <div className='container card mb-3 mt-5'>
      <div className='row g-0'>
        <div className={`col-md-5 ${classes.image}`}>
          <Image
            src={results.Poster !== 'N/A' ? results.Poster : '/placeholder.png'}
            alt={`${results.Title} poster`}
            width={300}
            height={444}
            unoptimized
          />
        </div>
        <div className='col-md-7'>
          <div className='card-body'>
            <h5 className='card-title'>
              {results.Title} ({results.Year})
            </h5>
            <p className='card-text'>{results.Plot}</p>
            <p className='card-text'>
              Starring: <small className='text-muted'>{results.Actors}</small>
            </p>
            <p className='card-text'>
              Writer(s): <small className='text-muted'> {results.Writer}</small>
            </p>
            <p className='card-text'>
              Director: <small className='text-muted'> {results.Director}</small>
            </p>
            <p className='card-text'>
              IMDb:{' '}
              <small className='text-muted'>
                {results.imdbRating} ({results.imdbVotes} votes)
              </small>
            </p>
            <p className='card-text'>
              Metascore:{' '}
              <small className='text-muted'>
                {results.Metascore ? results.Metascore : 'not available'}
              </small>
            </p>
            <p className='card-text'>
              Rated: <small className='text-muted'>{results.Rated}</small>
            </p>
            <div className='btn-group'>
              <button
                type='button'
                className={`btn ${isInWatched ? 'btn-success' : 'btn-outline-success'}`}
                onClick={addToWatched}
                disabled={isInWatched}
              >
                {isInWatched ? 'Watched' : 'Add to Watched'}
              </button>
              {!isInWatched && (
                <button
                  type='button'
                  className={`btn ${isInWatchlist ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={addToWatchlist}
                  disabled={isInWatchlist || isInWatched}
                >
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              )}
              {(isInWatched || isInWatchlist) && (
                <button type='button' className='btn btn-outline-danger' onClick={removeMovie}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
