import React , {useRef, useState}from 'react'
import {Link} from 'react-router-dom';
import './NavBar.css';
import {AccountCircle, EditNote} from '@mui/icons-material'
import { useSelector } from 'react-redux';
import Account from '../Account/Account';
import {Close, Menu, GroupWork, LocalLibrary, Home, People, Abc, School, AddCircle, Notifications} from '@mui/icons-material';

import {useNavigate} from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    const activeUser = useSelector(state => state.students.activeUser);

    const [activeNav, setActiveNav] = useState('Home');

   
    
    const [showMenu, setShowMenu] = React.useState(false);

    //active tab
    function handleActiveTab(e){
        setActiveNav(e.target.innerText);

    }

    //show account
    const [showAccount, setShowAccount] = useState(false);

    function handleToggleMenu(){
        setShowMenu(prev => !prev);
    }

     //handle show menu
     function handleShowAccount(){
        setShowAccount(prev => !prev);
    }

    
  return (
    <header>

        <Account handleShowAccount={handleShowAccount} show={showAccount} student={activeUser} handleClose={handleShowAccount}/>
        
        
        <nav className='desktop-nav'>
            <Link to={'/'} className="logo-container">
                <h1 className='logo-title'>CMS</h1>
                <p>Electrical Department D2</p>
            </Link>

            <ul className="nav-options-container">
                <div onClick={handleActiveTab} className="nav-option-container">
                    <Home className={`${activeNav === 'Home' && 'active-nav-icon'} nav-option-icon`} />
                    <Link to={'/'} className={`${activeNav === 'Home' && 'active-nav-option'} nav-option`}>Home</Link>
                </div>
                
                <div onClick={handleActiveTab} className="nav-option-container">
                    <School className={`${activeNav === 'Classes' && 'active-nav-icon'} nav-option-icon`} />
                    <Link to={'/classes'} className={`${activeNav === 'Classes' && 'active-nav-option'} nav-option`}>Classes</Link>
                </div>
                
                <div onClick={handleActiveTab} className="nav-option-container">
                    <People className={`${activeNav === 'Community' && 'active-nav-icon'} nav-option-icon`} />
                    <Link className={`${activeNav === 'Community' && 'active-nav-option'} nav-option`}>Community</Link>
                </div>
               
               <div onClick={handleActiveTab} className="nav-option-container">
                    <Abc className={`${activeNav === 'Modules' && 'active-nav-icon'} nav-option-icon`} />
                    <Link to={'/modules'} className={`${activeNav === 'Modules' && 'active-nav-option'} nav-option`}>Modules</Link>
               </div>
                
            </ul>

            <ul className="nav-options-container">
                <div onClick={handleActiveTab} className="nav-option-container">
                    <GroupWork  className={`${activeNav === 'Modules' && 'active-nav-icon'} group-icon nav-option-icon`} />
                    <Link to={'/groups'} className={`${activeNav === 'Groups' && 'active-nav-option'} nav-option`} >Groups</Link>
                </div>

                <div onClick={handleActiveTab} className="nav-option-container">
                    <LocalLibrary  className={`${activeNav === 'Students' && 'active-nav-icon'} students-icon nav-option-icon`} />
                    <Link to={'/students'} className={`${activeNav === 'Students' && 'active-nav-option'} nav-option`}>Students</Link>
                </div>
                
                {/* <Link className='nav-user' to={'/'}>{activeUserName}</Link> */}
                <div  onClick={handleShowAccount} className="profile-container">
                    <AccountCircle className='profile-icon'/>
                </div>
            </ul>

        </nav>

        <div className="mobile-cms-nav">

            <div className="cms-mobile-nav-top-container">
                <Link to={'/'} className="logo-container">
                        <p>CMS Electrical Department D2</p>
                </Link>

                <AddCircle className='cms-add-program-icon' />

                <div onClick={()=>{navigate('/announcements')}} className="cms-home-notification-container">
                    <Notifications className='cms-notification-icon'/>
                    <div className="cms-notifications-count">
                        1
                    </div>
                </div>

            </div>


            <div className="cms-mobile-nav-bottom-container">
                <div onClick={()=>{navigate('/')}}className="nav-option-container">
                    <Home className={`nav-option-icon`} />
                </div>
                
                <div onClick={()=>{navigate('/classes')}} className="nav-option-container">
                    <School className={`nav-option-icon`} /> 
                </div>
                
                <div className="nav-option-container">
                    <People className={`'active-nav-icon'} nav-option-icon`} />
                </div>
            
                <div onClick={()=>{navigate('/modules')}} className="nav-option-container">
                    <Abc className={`nav-option-icon`} />
                </div>

                <div onClick={()=>{navigate('/students')}} className="nav-option-container">
                    <LocalLibrary className={`nav-option-icon`} />
                </div>

                <div onClick={()=>{navigate('/groups')}} className="nav-option-container">
                    <GroupWork className={`nav-option-icon`} />
                </div>

                

                <div  onClick={handleShowAccount} className="profile-menu-icon-container">
                    {showAccount?<Close className='cms-menu-icon'/>:<Menu className='cms-menu-icon'/>}
                    
                </div>

                

            </div>

             {/* <Link className='nav-user' to={'/'}>{activeUserName}</Link> */}
             
        </div>

    </header>
  )
}

export default NavBar