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

export interface DataSWR {
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
  name: string
  loadPageFn?: (page: number, name: string) => Promise<void>
}
