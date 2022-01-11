import { useState } from 'react'
import Results from './results'
import SearchBar from './search-bar'
import { PaginationProps, ResponseData, SearchResult } from '../interfaces'
import Pagination from './pagination'

const Search = () => {
  const [results, setResults] = useState<SearchResult>()
  const [nameState, setNameState] = useState<string>('')
  const [pagination, setPagination] = useState<PaginationProps | undefined>()
  const [feedback, setFeedback] = useState<string | undefined>()

  const searchHandler = async (name: string) => {
    try {
      const res = await fetch(`/api/search/?name=${name}&page=1`)

      const data: ResponseData = await res.json()
      if (!data.success) {
        setFeedback(data.msg)
        setResults(undefined)
        setPagination(undefined)
        setTimeout(() => setFeedback(undefined), 2500)
        return
      }
      const totalPage = Math.ceil(+data.data!.totalResults / 10)

      setPagination({ totalPage, currentPage: 1, prev: 0, next: 2, name })
      setNameState(name)
      setResults(data.data)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const pageLoader = async (page: number, name: string) => {
    try {
      const res = await fetch(`/api/search/?name=${name}&page=${page}`)

      const data: ResponseData = await res.json()

      const totalPage = Math.ceil(+data.data!.totalResults / 10)
      setPagination({ totalPage, currentPage: page, prev: page - 1, next: page + 1, name })
      if (data.success === true) {
        setResults(data.data)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <>
      <SearchBar formHandler={searchHandler} />
      {feedback && <p className='w-75 center lead bg-info mt-2 rounded'>{feedback}</p>}
      <Results items={results} />
      {pagination && (
        <Pagination
          totalPage={pagination.totalPage}
          currentPage={pagination.currentPage}
          prev={pagination.prev}
          next={pagination.next}
          loadPageFn={pageLoader}
          name={nameState}
        />
      )}
    </>
  )
}

export default Search
