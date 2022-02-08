import { QueryClient } from 'react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export const fetchUser = async () => {
  const user = await fetch('/api/user')
  const res = await user.json()
  return res
}

export const addToWatched = async ({
  imdbid,
  title,
  year,
  poster
}: {
  imdbid: string
  title: string
  year: string
  poster: string
}) => {
  const res = await fetch('/api/movies/watched', {
    method: 'PATCH',
    body: JSON.stringify({ imdbid, title, year, poster }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.json()
}

export const addToWatchlist = async ({
  imdbid,
  title,
  year,
  poster
}: {
  imdbid: string
  title: string
  year: string
  poster: string
}) => {
  const res = await fetch('/api/movies/watchlist', {
    method: 'PATCH',
    body: JSON.stringify({ imdbid, title, year, poster }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.json()
}

export const removeMovie = async ({
  isInWatchlist,
  imdbid
}: {
  isInWatchlist: boolean
  imdbid: string
}) => {
  if (isInWatchlist) {
    const res = await fetch('/api/movies/watchlist', {
      method: 'DELETE',
      body: JSON.stringify({ imdbid }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return res.json()
  } else {
    const res = await fetch('/api/movies/watched', {
      method: 'DELETE',
      body: JSON.stringify({ imdbid }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return res.json()
  }
  return
}
