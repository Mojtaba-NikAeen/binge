import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import MovieDetails from '../../components/movie-details'
import { IDSearchResult, Torrent, YIFYResult } from '../../interfaces'

const MovieDetail = ({ data }: { data: IDSearchResult }) => {
  const router = useRouter()

  const [torrents, setTorrents] = useState<Torrent[] | undefined>()
  const [posterHQ, setPosterHQ] = useState<string | undefined>()

  const { status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace('/')
  })

  useSWR(
    status === 'authenticated'
      ? `https://yts.mx/api/v2/list_movies.json?query_term=${router.query.imdbId}`
      : null,
    {
      onSuccess: (dataS: YIFYResult) => {
        if (dataS.status === 'ok' && dataS.data.movie_count > 0) {
          setTorrents(dataS.data.movies[0].torrents)
          if (dataS.data.movies[0].large_cover_image) {
            setPosterHQ(dataS.data.movies[0].large_cover_image)
          }
        }
      }
    }
  )

  if (status === 'loading') return <></>

  if (data.Response === 'False') {
    return <p className='center fs-2 mt-2'>{data.Error}</p>
  }

  return (
    <>
      <MovieDetails results={data} hqPoster={posterHQ} />

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
                    {data.Title} {data.Year} {d.quality} {d.type}
                  </div>
                </div>
                <a href={d.url} className='badge btn btn-dark'>
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

export const getStaticProps: GetStaticProps = async context => {
  if (!context.params!.imdbId!.includes('tt')) {
    return {
      props: { data: { Response: 'False', Error: 'Incorrect IMDb ID' } }
    }
  }

  const response = await fetch(
    `http://www.omdbapi.com/?i=${context.params!.imdbId}&apikey=${process.env.API_KEY}`
  )

  const data: IDSearchResult = await response.json()

  return {
    props: { data }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default MovieDetail
