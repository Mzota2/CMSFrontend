import React from 'react'
import './Account.css';
import { AccountCircle , EditNote, Settings, AbcRounded, Notifications, Group, Logout, Close, Edit} from '@mui/icons-material';

import { Link } from 'react-router-dom';


function Account({student, handleClose, show}) {

  function viewAssignments(){

  }

  function viewExams(){

  }

  return (
    <div style={{animationName:`${show? 'slideInA':'slideOutA'}`}} className='cms-account-container'>

      <div onClick={handleClose} className="cms-mobile-menu-close-icon-container">
        <Close className='close-icon' />
      </div>

      <br />

      <div className="cms-account-user-info-container">

        <div className="cms-account-user-main-info">
          <AccountCircle className='cms-account-icon' />

          <div className="cms-account-user-info-details">
            <h3 className='cms-account-user-name'>{student?.username}</h3>
            <p className='cms-account-user-regNO'>{student?.regNO}</p>
          </div>
        </div>
        

        
          <div className="cms-account-user-edit-icon-container cms-btn">
            <Link to={'/settings'}>
              <Edit className='cms-account-user-edit-icon' />
            </Link>
          </div>
    
        
        

      </div>

      <hr  className='hr'/>


      <div className="cms-account-user-class-info-container">
        <div className="cms-account-user-class-info">
          <EditNote className='cms-account-user-class-info-icon' />
          <p>Assignments</p>
        </div>

        <div className="cms-account-user-class-info">
          <EditNote className='cms-account-user-class-info-icon' />
          <p>Exams</p>
        </div>

        <div className="cms-account-user-class-info">
          <Group className='cms-account-user-class-info-icon' />
          <p>Groups</p>
        </div>

        <div className="cms-account-user-class-info">
          <AbcRounded className='cms-account-user-class-info-icon' />
          <p>Program</p>
        </div>

      </div>

      <hr className='hr' />


      <div className="cms-account-user-important-container">

        <div className="cms-account-user-important">
          <Notifications className='cms-account-user-important-icon' />
          <p>Notifications</p>
        </div>

        <div className="cms-account-user-important">
          <Settings className='cms-account-user-important-icon' />
          <Link className='cms-link' to={'/settings'}>Settings</Link>
        </div>

        <div className="cms-account-user-important">
          <Logout className='cms-account-user-important-icon cms-logout-icon' />
          <p>Logout</p>
        </div>


      </div>


    </div>
  )
}

export default Account