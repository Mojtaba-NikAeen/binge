import { useIsFetching } from 'react-query'

const GlobalFetchingIndicator = () => {
  const isFetching = useIsFetching()

  return isFetching ? (
    <p style={{ position: 'fixed', bottom: '10px', right: '10px', fontSize: '1rem' }}>
      Fetching...
    </p>
  ) : null
}

export default GlobalFetchingIndicator
