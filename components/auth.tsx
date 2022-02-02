import Link from 'next/link'
import { FormEvent, useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

interface AuthProps {
  login: boolean
}

const Auth = ({ login }: AuthProps) => {
  const router = useRouter()
  const [formMsg, setFormMsg] = useState<string>()
  const [verifyLink, setVerifyLink] = useState<boolean>(false)
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false)

  const emailRef = useRef<HTMLInputElement>(null!)
  const passwordRef = useRef<HTMLInputElement>(null!)

  const clearMsg = () => setTimeout(() => setFormMsg(undefined), 3500)

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    setDisabledBtn(true)
    event.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    if (!email || !email.includes('@')) {
      setFormMsg('please provide a valid email')
      clearMsg()
      setDisabledBtn(false)
      return
    }

    if (!password || password.length < 6) {
      setFormMsg('please provide a valid password (no less than 6 characters)')
      clearMsg()
      setDisabledBtn(false)
      return
    }

    if (login) {
      try {
        const result: any = await signIn('credentials', { email, password, redirect: false })
        if (result.error === 'verify your email') {
          setFormMsg(result.error)
          clearMsg()
          setVerifyLink(true)
          setDisabledBtn(false)
          return
        }
        if (result.error) {
          setFormMsg(result.error)
          clearMsg()
          setDisabledBtn(false)
          return
        }

        router.replace('/')
      } catch (error) {
        setFormMsg('failed, try again')
        clearMsg()
        setDisabledBtn(false)
      }
    } else {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = await res.json()
        if (!data.success) {
          setFormMsg(data.msg)
          setDisabledBtn(false)
          return
        }

        setFormMsg('a verification token has been sent to your email (expires in 15 minutes)')
        clearMsg()

        emailRef.current.value = ''
        passwordRef.current.value = ''
      } catch (error) {
        setFormMsg('something went wrong')
        clearMsg()
        setDisabledBtn(false)
      }
    }
  }

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-7 col-lg-5 bg-light mt-5 rounded'>
          <div className='p-4'>
            <h3 className='mb-4'>{login ? 'Log In' : 'Sign Up'}</h3>
            <form onSubmit={submitHandler}>
              <div className='form-group mt-3'>
                <label>Email</label>
                <input type='email' className='form-control' required ref={emailRef} />
              </div>
              <div className='form-group mb-3'>
                <label>Password</label>
                <input
                  id='password-field'
                  type='password'
                  className='form-control'
                  required
                  ref={passwordRef}
                />
              </div>
              {formMsg && <p className='text-center bg-warning p-2 rounded'>{formMsg}</p>}
              <div className='form-group'>
                <button
                  type='submit'
                  disabled={disabledBtn}
                  className='form-control btn btn-primary rounded submit px-3'
                >
                  {(disabledBtn && 'Sending..') || (login ? 'Log In' : 'Sign Up')}
                </button>
              </div>
            </form>
            <p className='text-center'>
              {login ? (
                <>
                  Not a member? <Link href={'/auth/signup'}>Sign Up</Link> <br />
                  {verifyLink && <Link href={'/auth/verifyemail'}>Verify Email</Link>}
                </>
              ) : (
                <>
                  already a member? <Link href={'/auth/login'}>Log in</Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
