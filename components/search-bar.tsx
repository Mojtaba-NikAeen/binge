import { FormEvent, useRef, useState } from 'react'

interface SearchBarProps {
  formHandler: (name: string) => void
}

const SearchBar = ({ formHandler }: SearchBarProps) => {
  const [msg, setMsg] = useState<string>()

  const nameRef = useRef<HTMLInputElement>(null!)

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const enteredName = nameRef.current.value

    if (enteredName.trim().length < 3) {
      setMsg('movie name must at least be 3 characters')
      return
    }

    formHandler(enteredName)
    setMsg(undefined)
    nameRef.current.value = ''
  }
  return (
    <>
      <form onSubmit={submitHandler}>
        <div className='input-group center w-50'>
          <input type='text' className='form-control' placeholder='Movie Name' ref={nameRef} />

          <button className='btn btn-success'>Search</button>
        </div>
      </form>
      {msg && <p className='w-50 center lead bg-info mt-2 rounded'>{msg}</p>}
    </>
  )
}

export default SearchBar
