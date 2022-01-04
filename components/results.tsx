import Image from 'next/image'
import Link from 'next/link'
import classes from './results.module.css'
import { SearchResult } from '../interfaces'

const Results = ({ items }: { items: SearchResult | undefined }) => {
  if (!items || items.Error) {
    return <p>{items?.Error}</p> || <p>nothing was found</p>
  }

  return (
    <>
      {items.Search.map(item => (
        <div className='card mb-3 mt-3' key={`${item.imdbID}${Math.ceil(Math.random() * 10000)}`}>
          <div className='row g-0'>
            <div className={`col-md-4 ${classes.image}`}>
              <Image
                src={item.Poster !== 'N/A' ? item.Poster : '/placeholder.png'}
                alt=''
                width={'431px'}
                height={'250px'}
                quality={80}
              />
            </div>
            <div className='col-md-8'>
              <div className='card-body'>
                <h5 className='card-title'>{item.Title}</h5>
                {/* <p className='card-text'>
                  PLOT: This is a wider card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer.
                </p> */}
                <p>
                  <small className='text-muted'>Year: {item.Year}</small>
                </p>
                <div>
                  <Link href={`/movies/${item.imdbID}`}>
                    <a className='btn btn-outline-info'>More Details</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default Results
