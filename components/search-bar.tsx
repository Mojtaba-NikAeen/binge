import { FormEvent, useRef, useState } from 'react'

interface SearchBarProps {
  formHandler: (name: string, year: string) => void
}

const SearchBar = ({ formHandler }: SearchBarProps) => {
  const [msg, setMsg] = useState<string>()

  const nameRef = useRef<HTMLInputElement>(null!)
  const yearRef = useRef<HTMLInputElement>(null!)

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const enteredYear = yearRef.current.value
    const enteredName = nameRef.current.value

    if (enteredYear.trim() === '' || enteredName.trim() === '') {
      setMsg('please fill out the fields')
      return
    }

    if (
      /^\d+$/.test(enteredYear) === false ||
      enteredYear.length !== 4 ||
      +enteredYear > 2025 ||
      +enteredYear < 1900
    ) {
      setMsg('number must be 4 digits and between 1900 & 2025')
      return
    }

    if (enteredName.trim().length < 3) {
      setMsg('movie name must at least be 3 characters')
      return
    }

    formHandler(enteredYear, enteredName)
    setMsg(undefined)
    yearRef.current.value = ''
    nameRef.current.value = ''
  }
  return (
    <>
      <form className='row g-3' onSubmit={submitHandler}>
        <div className='col-sm'>
          <input type='text' className='form-control' placeholder='Movie Name' ref={nameRef} />
        </div>
        <div className='col-sm'>
          <input type='text' className='form-control' placeholder='Year' ref={yearRef} />
        </div>
        <div className='col-sm'>
          <button className='btn btn-success'>Search</button>
        </div>
      </form>
      {msg && <p className='text-center lead bg-info mt-3'>{msg}</p>}
    </>
  )
}

export default SearchBar
