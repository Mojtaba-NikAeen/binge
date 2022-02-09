import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import MovieDetails from '../../components/movie-details'
import { IDSearchResult, Torrent, YIFYResult } from '../../interfaces'

const MovieDetail = ({ data, torrents }: { data: IDSearchResult; torrents: Torrent[] }) => {
  if (data.Response === 'False') {
    return <p className='center fs-2 mt-2'>{data.Error}</p>
  }

  return (
    <>
      <MovieDetails results={data} />

      <div className='container bg-light rounded-3 mt-5'>
        <h3 className='mt-2 mb-2 center'>Download this movie via torrent</h3>
        <ul className='list-group pb-4 center'>
          {torrents ? (
            torrents.map(d => (
              <li
                key={d.hash}
                className='list-group-item d-flex justify-content-between align-items-start'
              >
                <div className='ms-2 me-auto'>
                  <div className='fw-bold'>
                    {data.Title} {data.Year} {d.quality} {d.type} ({d.size})
                  </div>
                </div>
                <a
                  href={d.url}
                  className='badge btn btn-dark'
                  style={{ display: 'block', textDecoration: 'none', color: 'black' }}
                >
                  Download
                </a>
              </li>
            ))
          ) : (
            <p>No torrent was found for this movie</p>
          )}
        </ul>
      </div>
    </>
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

  if (!context.params!.imdbId!.includes('tt')) {
    return {
      props: { data: { Response: 'False', Error: 'Incorrect IMDb ID' } }
    }
  }

  const response = await fetch(
    `http://www.omdbapi.com/?i=${context.params!.imdbId}&apikey=${process.env.API_KEY}`
  )

  const data: IDSearchResult = await response.json()

  const yify = await fetch(
    `https://yts.mx/api/v2/list_movies.json?query_term=${context.params!.imdbId}`
  )
  const yifyRes: YIFYResult = await yify.json()

  let torrents
  if (yifyRes.status === 'ok' && yifyRes.data.movie_count > 0) {
    torrents = yifyRes.data.movies[0].torrents
    if (yifyRes.data.movies[0].large_cover_image) {
      data.Poster = yifyRes.data.movies[0].large_cover_image
    }
  }

  return {
    props: { data, torrents }
  }
}

export default MovieDetail
