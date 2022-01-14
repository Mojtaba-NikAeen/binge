import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import MovieDetails from '../../components/movie-details'
import { IDSearchResult, Torrent } from '../../interfaces'

interface MovieDetailProps {
  data: IDSearchResult
  torrents: Torrent
}

const MovieDetail = ({ data, torrents }: MovieDetailProps) => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace('/')
  })

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

  const yifyRes = await fetch('/api/findtorrent', {
    method: 'POST',
    body: JSON.stringify({ imdbid: context.params!.imdbId }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const yifyTorrents: Torrent = await yifyRes.json()

  return {
    props: { data, torrents: yifyTorrents }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default MovieDetail
