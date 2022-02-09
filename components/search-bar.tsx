import { Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react'
import { useIsFetching } from 'react-query'

interface SearchBarProps {
  setName: Dispatch<SetStateAction<string | undefined>>
}

const SearchBar = ({ setName }: SearchBarProps) => {
  const [msg, setMsg] = useState<string>()
  const isFetching = useIsFetching()
  const nameRef = useRef<HTMLInputElement>(null!)

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const enteredName = nameRef.current.value

    if (enteredName.trim().length < 3) {
      setMsg('movie name must at least be 3 characters')
      setTimeout(() => setMsg(undefined), 3500)
      return
    }
    setName(enteredName)
    setMsg(undefined)
    nameRef.current.value = ''
  }
  return (
    <>
      <form onSubmit={submitHandler}>
        <div className='input-group center w-75'>
          <input type='text' className='form-control' placeholder='Movie Name' ref={nameRef} />

          <button className='btn btn-success' disabled={!!isFetching}>
            Search
          </button>
        </div>
      </form>
      {msg && <p className='w-75 center lead bg-info mt-2 rounded'>{msg}</p>}
    </>
  )
}

export default SearchBar
