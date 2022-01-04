import Link from 'next/link'
import classes from './navbar.module.css'

const NavBar = () => {
  return (
    <nav className={`navbar navbar-dark bg-dark ${classes.header}`}>
      <div className='container'>
        <Link href={'/'}>
          <a className='navbar-brand'>IMDb kinda</a>
        </Link>
        <div className='btn-group'>
          <Link href={'/auth/login'} passHref>
            <button type='button' className='btn btn-success'>
              Login
            </button>
          </Link>
          <Link href={'/auth/signup'} passHref>
            <button type='button' className='btn btn-warning'>
              Sign-up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
