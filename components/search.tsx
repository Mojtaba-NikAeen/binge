import { useState } from 'react'
import Results from './results'
import SearchBar from './search-bar'
import { PaginationProps, SearchResult } from '../interfaces'
import Pagination from './pagination'

interface Data {
  success: boolean
  data: SearchResult
}

const Search = () => {
  const [results, setResults] = useState<SearchResult>()
  const [name, setName] = useState<string>('')
  const [pagination, setPagination] = useState<PaginationProps | undefined>(undefined)

  const searchHandler = async (name: string) => {
    try {
      const res = await fetch(`/api/search/?name=${name}&page=1`)

      const data: Data = await res.json()

      setName(name)
      const totalPage = Math.ceil(+data.data.totalResults / 10)
      setPagination({ totalPage, currentPage: 1, prev: 0, next: 2, name })
      if (data.success === true) {
        setResults(data.data)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const pageLoader = async (page: number, name: string) => {
    try {
      const res = await fetch(`/api/search/?name=${name}&page=${page}`)

      const data: Data = await res.json()

      const totalPage = Math.ceil(+data.data.totalResults / 10)
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
      <Results items={results} />
      {pagination && (
        <Pagination
          totalPage={pagination.totalPage}
          currentPage={pagination.currentPage}
          prev={pagination.prev}
          next={pagination.next}
          loadPageFn={pageLoader}
          name={name}
        />
      )}
    </>
  )
}

export default Search
