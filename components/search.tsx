import { useState } from 'react'
import Results from './results'
import SearchBar from './search-bar'
import { PaginationProps, SearchResult } from '../interfaces'
import Pagination from './pagination'
import { useQuery } from 'react-query'
import { searchMovies } from '../libs/reactQuery'

const Search = () => {
  const [results, setResults] = useState<SearchResult>()
  const [nameState, setNameState] = useState<string | undefined>()
  const [page, setPage] = useState<number>(1)
  const [pagination, setPagination] = useState<PaginationProps | undefined>()
  const [feedback, setFeedback] = useState<string | undefined>()

  // TODO handle errors
  useQuery(['search', nameState, page], () => searchMovies(nameState!, page), {
    keepPreviousData: true,
    enabled: !!nameState,
    onSuccess: data => {
      if (!data.success) {
        setFeedback(data.msg)
        setResults(undefined)
        setPagination(undefined)
        setTimeout(() => setFeedback(undefined), 2500)
        return
      }
      const totalPage = Math.ceil(+data.data!.totalResults / 10)
      setPagination({ totalPage, currentPage: page, prev: page - 1, next: page + 1 })
      setResults(data.data)
    },
    onError: err => {
      console.log(err)
    }
  })

  return (
    <>
      <SearchBar setName={setNameState} />
      {feedback && <p className='w-75 center lead bg-info mt-2 rounded'>{feedback}</p>}
      <Results items={results} />
      {pagination && (
        <Pagination
          totalPage={pagination.totalPage}
          currentPage={pagination.currentPage}
          prev={pagination.prev}
          next={pagination.next}
          setPage={setPage}
        />
      )}
    </>
  )
}

export default Search
