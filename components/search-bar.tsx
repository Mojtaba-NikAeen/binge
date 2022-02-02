import { FormEvent, useRef, useState } from 'react'

interface SearchBarProps {
  formHandler: (name: string) => Promise<void>
}

const SearchBar = ({ formHandler }: SearchBarProps) => {
  const [msg, setMsg] = useState<string>()
  const [disableBtn, setDisableBtn] = useState<boolean>(false)

  const nameRef = useRef<HTMLInputElement>(null!)

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    setDisableBtn(true)
    event.preventDefault()
    const enteredName = nameRef.current.value

    if (enteredName.trim().length < 3) {
      setMsg('movie name must at least be 3 characters')
      setTimeout(() => setMsg(undefined), 3500)
      setDisableBtn(false)
      return
    }

    await formHandler(enteredName)
    setMsg(undefined)
    nameRef.current.value = ''
    setDisableBtn(false)
  }
  return (
    <>
      <form onSubmit={submitHandler}>
        <div className='input-group center w-75'>
          <input type='text' className='form-control' placeholder='Movie Name' ref={nameRef} />

          <button className='btn btn-success' disabled={disableBtn}>
            {disableBtn ? 'Searching' : 'Search'}
          </button>
        </div>
      </form>
      {msg && <p className='w-75 center lead bg-info mt-2 rounded'>{msg}</p>}
    </>
  )
}

export default SearchBar
