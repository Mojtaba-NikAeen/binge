import { Dispatch, SetStateAction } from 'react'

export interface SearchResult {
  Error?: string
  Search: Search[]
  totalResults: string
  Response: string
}

export interface Search {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface IDSearchResult {
  Error?: string
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Rating[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

export interface Rating {
  Source: string
  Value: string
}

export interface ResponseData {
  success: boolean
  data?: SearchResult
  msg?: string
}

export interface UserQuery {
  data: Data
}

export interface Data {
  _id: string
  email: string
  password: string
  watchlist: string[]
  watched: string[]
  createdAt: Date
  __v: number
  watchlistV: Watch[]
  watchedV: Watch[]
  id: string
}

export interface Watch {
  _id: string
  imdbid: string
  title: string
  year: number
  poster: string
  __v: number
}

export interface PaginationProps {
  prev: number
  next: number
  currentPage: number
  totalPage: number
  setPage?: Dispatch<SetStateAction<number>>
}

export interface YIFYResult {
  status: string
  status_message: string
  data: Data
}

export interface Data {
  movie_count: number
  limit: number
  page_number: number
  movies: Movie[]
}

export interface Movie {
  id: number
  url: string
  imdb_code: string
  title: string
  title_english: string
  title_long: string
  slug: string
  year: number
  rating: number
  runtime: number
  genres: string[]
  summary: string
  description_full: string
  synopsis: string
  yt_trailer_code: string
  language: string
  mpa_rating: string
  background_image: string
  background_image_original: string
  small_cover_image: string
  medium_cover_image: string
  large_cover_image: string
  state: string
  torrents: Torrent[]
  date_uploaded: Date
  date_uploaded_unix: number
}

export interface Torrent {
  url: string
  hash: string
  quality: string
  type: string
  seeds: number
  peers: number
  size: string
  size_bytes: number
  date_uploaded: Date
  date_uploaded_unix: number
}
