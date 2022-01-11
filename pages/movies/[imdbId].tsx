import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import MovieDetails from '../../components/movie-details'
import { IDSearchResult } from '../../interfaces'

const MovieDetail = ({ data }: { data: IDSearchResult }) => {
  if (data.Response === 'False') {
    return <p className='center fs-2 mt-2'>{data.Error}</p>
  }

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

// export const getServerSideProps: GetServerSideProps = async context => {
//   if (!context.params!.imdbId!.includes('tt')) {
//     return {
//       props: { data: { Response: 'False', Error: 'Wrong IMDbID' } }
//     }
//   }

//   const response = await fetch(
//     `http://www.omdbapi.com/?i=${context.params!.imdbId}&apikey=${process.env.API_KEY}`
//   )

//   const data: IDSearchResult = await response.json()

//   return {
//     props: { data }
//   }
// }

export default MovieDetail
