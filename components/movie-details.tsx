import Image from 'next/image'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { UserQuery, IDSearchResult } from '../interfaces'
import {
  addToWatched,
  addToWatchlist,
  fetchUser,
  queryClient,
  removeMovie
} from '../libs/reactQuery'
import classes from './movie-details.module.css'

const MovieDetails = ({ results }: { results: IDSearchResult }) => {
  const [lists, setLists] = useState<any>()

  useQuery<UserQuery>('user', fetchUser, {
    onSuccess: data => setLists({ watched: data.data.watched, watchlist: data.data.watchlist })
  })

  // TODO add high quality poster link
  // TODO handle them errors
  const addToWatchedMutation = useMutation(addToWatched, {
    onSuccess: () => queryClient.invalidateQueries('user'),
    onError: () => console.log('error addtowatched')
  })

  const addToWatchlistMutation = useMutation(addToWatchlist, {
    onSuccess: () => queryClient.invalidateQueries('user'),
    onError: () => console.log('error addtowatchlist')
  })

  const removeMovieMutation = useMutation(removeMovie, {
    onSuccess: () => queryClient.invalidateQueries('user'),
    onError: () => console.log('error removemovie')
  })

  if (!lists) return <p className='center fs-4 mt-2'>Loading...</p>

  const isInWatched: boolean = lists.watched.includes(results.imdbID)
  const isInWatchlist: boolean = lists.watchlist.includes(results.imdbID)

  const poster = results.Poster !== 'N/A' ? results.Poster : '/placeholder.png'

  return (
    <div className='container card mb-3 mt-5 p-0'>
      <div className='row g-0'>
        <div className={`col-md-5 ${classes.image}`}>
          <Image
            src={poster}
            alt={`${results.Title} poster`}
            width={300}
            height={444}
            quality={85}
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
            <a href={results.Poster} target='_blank' rel='noreferrer' className='posterlink'>
              Click to see Poster in Original Size
            </a>
            <div className='btn-group'>
              <button
                type='button'
                className={`btn ${isInWatched ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() =>
                  addToWatchedMutation.mutate({
                    imdbid: results.imdbID,
                    poster: results.Poster,
                    title: results.Title,
                    year: results.Year
                  })
                }
                disabled={isInWatched}
              >
                {isInWatched ? 'Watched' : 'Add to Watched'}
              </button>
              {!isInWatched && (
                <button
                  type='button'
                  className={`btn ${isInWatchlist ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() =>
                    addToWatchlistMutation.mutate({
                      imdbid: results.imdbID,
                      poster: results.Poster,
                      title: results.Title,
                      year: results.Year
                    })
                  }
                  disabled={isInWatchlist || isInWatched}
                >
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              )}
              {(isInWatched || isInWatchlist) && (
                <button
                  type='button'
                  className='btn btn-outline-danger'
                  onClick={() =>
                    removeMovieMutation.mutate({
                      imdbid: results.imdbID,
                      isInWatchlist: isInWatchlist
                    })
                  }
                >
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
