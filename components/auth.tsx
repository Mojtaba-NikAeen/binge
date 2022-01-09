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

  const emailRef = useRef<HTMLInputElement>(null!)
  const passwordRef = useRef<HTMLInputElement>(null!)

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    if (!email || !email.includes('@')) {
      setFormMsg('please provide a valid email')
      return
    }

    if (!password || password.length < 6) {
      setFormMsg('please provide a valid password (no less than 6 characters)')
      return
    }

    if (login) {
      // TODO try catch
      const result: any = await signIn('credentials', { email, password, redirect: false })
      if (result.error === 'verify your email') {
        setFormMsg(result.error)
        setVerifyLink(true)
        return
      }
      if (result.error) {
        setFormMsg(result.error)
        return
      }
      setFormMsg('success')

      router.replace('/')
    } else {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()
      if (!data.success) {
        console.log(data)
        setFormMsg(data.msg)
        return
      }

      setFormMsg('a verification token has been sent to your email (expires in 15 minutes)')

      emailRef.current.value = ''
      passwordRef.current.value = ''
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
                <button type='submit' className='form-control btn btn-primary rounded submit px-3'>
                  {login ? 'Log In' : 'Sign Up'}
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
