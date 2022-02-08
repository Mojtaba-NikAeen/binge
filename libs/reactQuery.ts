import { QueryClient } from 'react-query'

export const fetchUser = async () => {
  const user = await fetch('/api/user')
  const res = await user.json()
  return res
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})
