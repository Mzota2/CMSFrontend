import React from 'react'
import {Link} from 'react-router-dom';
import './NavBar.css';
import {AccountCircle} from '@mui/icons-material'
import { useSelector } from 'react-redux';
import {Close, Menu} from '@mui/icons-material'

function NavBar() {
    const activeUserName = useSelector(state => state.students.activeUser?.name)
    const [showMenu, setShowMenu] = React.useState(false);

    function handleToggleMenu(){
        setShowMenu(prev => !prev);
    }
  return (
    <header>
        <nav className='desktop-nav'>
            <Link to={'/'} className="logo-container">
                <h1 className='logo-title'>CMS</h1>
                <p>Electrical Department D2</p>
            </Link>

            <ul className="nav-options-container">
                <Link to={'/'} className='nav-option'>Home</Link>
                <Link className='nav-option'>Classes</Link>
                <Link className='nav-option'>Community</Link>
                <Link className='nav-option'>Modules</Link>
            </ul>

            <ul className="nav-options-container">
                <Link to={'/groups'} className='nav-option' >Groups</Link>
                <Link className='nav-option'>Student</Link>
                {/* <Link className='nav-user' to={'/'}>{activeUserName}</Link> */}
                <Link to={'/signin'} className='nav-option'>Logout</Link>
                <div className="profile-container">
                    <AccountCircle className='profile-icon'/>
                </div>
            </ul>

        </nav>

        <nav className="mobile-nav">

            <Link to={'/'} className="logo-container">
                    <h1 className='logo-title'>CMS</h1>
                    <p>Electrical Department D2</p>
            </Link>

            <div className="mobile-nav-inner">
                <Link className='nav-user' to={'/'}>{activeUserName}</Link>

                <Menu onClick={handleToggleMenu} className='menu-icon'/>
            </div>

            {showMenu?<div className="mobile-menu">
                <Close onClick={handleToggleMenu} className='close-icon'/>
                <ul className="nav-options-container">
                    <Link to={'/'} className='nav-option'>Home</Link>
                    <Link className='nav-option'>Classes</Link>
                    <Link className='nav-option'>Community</Link>
                    <Link className='nav-option'>Modules</Link>
                </ul>

                <br />

                <ul className="nav-options-container">
                    <Link to={'/groups'} className='nav-option' >Groups</Link>
                    <Link className='nav-option'>Student</Link>
                        
                    <Link to={'/signin'} className='nav-option'>Logout</Link>
            
                </ul>
            </div>:<></>}

            
        </nav>

    </header>
  )
}

export default NavBar