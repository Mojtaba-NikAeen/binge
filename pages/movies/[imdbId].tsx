import { GetServerSideProps } from 'next'
import MovieDetails from '../../components/movie-details'
import { IDSearchResult } from '../../interfaces'

const MovieDetail = ({ data }: { data: IDSearchResult }) => {
  if (data.Response === 'False') {
    return <p>{data.Error}</p>
  }

  return <MovieDetails results={data} />
}

export const getServerSideProps: GetServerSideProps = async context => {
  const response = await fetch(
    `http://www.omdbapi.com/?i=${context.params!.imdbId}&apikey=${process.env.API_KEY}`
  )

  const data: IDSearchResult = await response.json()

  return {
    props: { data }
  }
}

export default MovieDetail
