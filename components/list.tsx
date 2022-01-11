import Image from 'next/image'
import Link from 'next/link'
import { Watch } from '../interfaces'
import classes from './list.module.css'

interface ListProps {
  data: Watch[]
  watchlist: boolean
  removeFn: (name: string, imdbid: string) => void
  addWatched?: (imdbid: string) => void
}

const List = ({ data, watchlist, removeFn, addWatched }: ListProps) => {
  if (!data) return <p>no movies in this list</p>

  const addToWatchedHandler = (imdbid: string) => {
    if (addWatched) {
      addWatched(imdbid)
    }
  }

  const removeHandler = (imdbid: string) => {
    if (watchlist) {
      removeFn('watchlist', imdbid)
    } else {
      removeFn('watched', imdbid)
    }
  }

  return (
    <div className='row'>
      {data.map(movie => {
        return (
          <div className='col-md-3 mb-2' key={`${movie._id}${Math.ceil(Math.random() * 10000)}`}>
            <div className='card'>
              <Image
                src={movie.poster !== 'N/A' ? movie.poster : '/placeholder.png'}
                alt={movie.title}
                width={200}
                height={300}
                unoptimized
              />

              <div className='card-body'>
                <Link href={`/movies/${movie.imdbid}`}>
                  <a className={`card-title d-block btn btn-outline-dark ${classes.titleText}`}>
                    {movie.title} ({movie.year})
                  </a>
                </Link>

                <div className='btn-group-vertical w-100 center'>
                  {watchlist && (
                    <a
                      className='btn btn-outline-success'
                      onClick={() => addToWatchedHandler(movie.imdbid)}
                    >
                      Add to Watched
                    </a>
                  )}
                  <a className='btn btn-outline-danger' onClick={() => removeHandler(movie.imdbid)}>
                    Remove
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default List
