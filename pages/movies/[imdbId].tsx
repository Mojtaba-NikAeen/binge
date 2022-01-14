import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MovieDetails from '../../components/movie-details'
import { IDSearchResult, Torrent } from '../../interfaces'

const MovieDetail = ({ data }: { data: IDSearchResult }) => {
  const router = useRouter()
  const [torrents, setTorrents] = useState<Torrent | undefined>()
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace('/')
  })

  useEffect(() => {
    if (status === 'authenticated') {
      fetch(`${process.env.SERVER_URL}/api/findtorrent`, {
        method: 'POST',
        body: JSON.stringify({ imdbid: router.query.imdbId }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then((torrents: Torrent) => {
          setTorrents(torrents)
        })
    }
  }, [router.query.imdbId, status])

  if (status === 'loading') {
    return <></>
  }

  if (data.Response === 'False') {
    return <p className='center fs-2 mt-2'>{data.Error}</p>
  }

  console.log(torrents)

  return <MovieDetails results={data} />
}

export const getStaticProps: GetStaticProps = async context => {
  if (!context.params!.imdbId!.includes('tt')) {
    return {
      props: { data: { Response: 'False', Error: 'Wrong IMDbID' } }
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
