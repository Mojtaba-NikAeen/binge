import Image from 'next/image'
import { IDSearchResult } from '../interfaces'
import classes from './movie-details.module.css'

const MovieDetails = ({ results }: { results: IDSearchResult }) => {
  return (
    <div className='container card mb-3 mt-5'>
      <div className='row g-0'>
        <div className={`col-md-4 ${classes.image}`}>
          <Image
            src={results.Poster !== 'N/A' ? results.Poster : '/placeholder.png'}
            alt=''
            width={'431px'}
            height={'316px'}
            unoptimized
          />
        </div>
        <div className='col-md-8'>
          <div className='card-body'>
            <h5 className='card-title'>
              {results.Title} ({results.Year})
            </h5>
            <p className='card-text'>{results.Plot}</p>
            <p className='card-text'>
              <small className='text-muted'>Starring: {results.Actors}</small>
            </p>
            <p className='card-text'>
              <small className='text-muted'>Director: {results.Director}</small>
            </p>
            <p className='card-text'>
              <small className='text-muted'>
                IMDb: {results.imdbRating} ({results.imdbVotes} votes)
              </small>
            </p>
            <div className='btn-group'>
              <button type='button' className='btn btn-success'>
                Add to Watched
              </button>
              <button type='button' className='btn btn-info'>
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
