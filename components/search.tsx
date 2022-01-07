import { useState } from 'react'
import Results from './results'
import SearchBar from './search-bar'
import { SearchResult } from '../interfaces'

interface Data {
  success: boolean
  data: SearchResult
}

const Search = () => {
  const [results, setResults] = useState<SearchResult>()

  const searchHandler = async (year: string, name: string) => {
    const res = await fetch(`/api/search/?name=${name}&year=${year}`)

    const data: Data = await res.json()
    // TODO pagination for total results
    console.log(data.data.totalResults)
    if (data.success === true) {
      setResults(data.data)
    }
  }

  return (
    <>
      <SearchBar formHandler={searchHandler} />
      <Results items={results} />
    </>
  )
}

export default Search
