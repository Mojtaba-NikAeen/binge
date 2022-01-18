import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { FormEvent, useRef, useState } from 'react'

const VerifyEmailPage = () => {
  const [formMsg, setFormMsg] = useState<string | undefined>()
  const emailRef = useRef<HTMLInputElement>(null!)

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = emailRef.current.value
    try {
      const res = await fetch('/api/auth/verifyemail', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()

      if (!data.success) {
        setFormMsg(data.msg)
        setTimeout(() => setFormMsg(undefined), 4000)
        return
      }

      setFormMsg(data.msg)
      return
    } catch (error: any) {
      setFormMsg(error.message || 'something went wrong, try again later')
    }
  }

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-7 col-lg-5 bg-light mt-5 rounded'>
          <div className='p-4'>
            <h3 className='mb-4'>Verify Email</h3>
            <form onSubmit={submitHandler}>
              <div className='form-group mt-3'>
                <label>Email</label>
                <input type='email' className='form-control' required ref={emailRef} />
              </div>
              {formMsg && <p className='text-center bg-warning mt-2 p-2 rounded'>{formMsg}</p>}
              <div className='form-group mt-2'>
                <button type='submit' className='form-control btn btn-primary rounded submit px-3'>
                  Send Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export default VerifyEmailPage
