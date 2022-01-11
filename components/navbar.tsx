import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import classes from './navbar.module.css'

const NavBar = () => {
  const { status } = useSession()

  // const unAuth = (
  //   <div className='btn-group'>
  //     <Link href={'/auth/login'}>
  //       <a className='btn btn-success'>Login</a>
  //     </Link>
  //     <Link href={'/auth/signup'}>
  //       <a className='btn btn-warning'>Sign-up</a>
  //     </Link>
  //   </div>
  // )

  const auth = (
    <div className='btn-group'>
      <Link href={'/profile'}>
        <a className='btn btn-success'>Profile</a>
      </Link>
      <a className='btn btn-info' onClick={() => signOut({ redirect: false })}>
        Logout
      </a>
    </div>
  )

  return (
    <nav className={`navbar navbar-dark bg-dark ${classes.header} sticky-top`}>
      <div className='container'>
        <Link href={'/'}>
          <a className={`navbar-brand ${classes.logo}`}>BingedThat</a>
        </Link>
        {status === 'authenticated' && auth}
      </div>
    </nav>
  )
}

export default NavBar
