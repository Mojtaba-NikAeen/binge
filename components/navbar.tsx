import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import classes from './navbar.module.css'

const NavBar = () => {
  const { status } = useSession()

  const unAuth = (
    <Link href={'/'}>
      <a className={`navbar-brand ${classes.logo} center`}>BingedThat</a>
    </Link>
  )

  const auth = (
    <>
      <Link href={'/profile'}>
        <a className={classes.roundedBtn}>
          <abbr title='Profile' style={{ cursor: 'pointer' }}>
            <Image src={'/profile.png'} alt='profile logo' width={58} height={58} unoptimized />
          </abbr>
        </a>
      </Link>
      <Link href={'/'}>
        <a className={`navbar-brand ${classes.logo}`}>BingedThat</a>
      </Link>

      <a className={classes.roundedBtn} onClick={() => signOut({ redirect: false })}>
        <abbr title='Logout' style={{ cursor: 'pointer' }}>
          <Image src={'/logout.png'} alt='profile logo' width={58} height={58} unoptimized />
        </abbr>
      </a>
    </>
  )

  return (
    <nav className={`navbar navbar-dark bg-dark ${classes.header} sticky-top`}>
      <div className='container'>{status === 'authenticated' ? auth : unAuth}</div>
    </nav>
  )
}

export default NavBar
