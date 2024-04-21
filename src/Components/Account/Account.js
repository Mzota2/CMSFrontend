import React, {useEffect, useRef, useState} from 'react'
import './Account.css';
import { AccountCircle , EditNote, Settings,GroupWork, Notifications, Group, Logout, Close, Edit, Engineering, Tag, Help, LightbulbCircle} from '@mui/icons-material';
import {message} from 'antd'
import { Link, useNavigate } from 'react-router-dom';


function Account({student, handleClose, show, handleShowAccount}) {
  const navigate = useNavigate();
  const menu = useRef(null);

  const [logingOut, setLogingOut] = useState(false);

  function handleClickMenu(e){
    if(!menu?.current){
      handleClose();
    }
  }

  function logout(){
    setLogingOut(true);
    setTimeout(()=>{
      localStorage.removeItem('cms-user');
      navigate('/signin');
      message.success("Loged out successfully");
    }, 2000);
   
  }

  useEffect(()=>{


    document.addEventListener('click', (e)=>{
      handleClickMenu(e)
    })

    return (()=>{
      document.removeEventListener('click', (e)=>{
        handleClickMenu(e)
      })
    })
  }, [])

  return (
    <div ref={menu}  style={{animationName:`${show? 'slideInA':'slideOutA'}`}}  className='cms-account-container'>
    
      <div className="cms-account-user-info-container">
        <div  onClick={handleShowAccount} className="profile-menu-icon-container cms-account-profile-menu-icon">
              {show && <Close className='cms-menu-icon'/>}
        </div>

        <div className="cms-account-student-container">
          <div onClick={()=>{navigate('/settings')}} className="cms-engineer-icon-container">
            <Engineering className='cms-account-engineer-icon'/>
          </div>

          <div className="cms-account-student-details">
            <p><strong>{student?.username}</strong></p>
            <p className='cms-account-student-regNo'>{student?.regNO}</p>
          </div>
       
        </div>

        <div className="cms-account-shortcut-container">
          <p>Your shortcuts</p>
        </div>
        
        <hr className='hrb' />

        <div className="cms-account-student-important-container">

          <div onClick={()=>{navigate('/assignments')}} className="cms-account-student-important">
              <EditNote className='cms-account-icon'/>
              <p className='cms-account-important-title'>Assignments</p>
          </div>

          <div onClick={()=>{navigate('/groups')}} className="cms-account-student-important">
              <GroupWork className='cms-account-icon'/>
              <p className='cms-account-important-title'>Groups</p>
          </div>

          <div onClick={()=>{navigate('/exams')}} className="cms-account-student-important">
              <EditNote className='cms-account-icon'/>
              <p className='cms-account-important-title'>Exams</p>
          </div>

          <div className="cms-account-student-important">
              <Tag className='cms-account-icon'/>
              <p className='cms-account-important-title'>Tags</p>
          </div>

        </div>

        <hr className='hrb' />


        <div className="cms-account-student-additional-container">

          <div className="cms-account-student-additional">
              <LightbulbCircle className='cms-account-icon'/>
              <p className='cms-account-important-title'>Suggestion Box</p>
          </div>

          <div className="cms-account-student-additional">
              <Help className='cms-account-icon'/>
              <p className='cms-account-important-title'>Help & Support</p>
          </div>

          <div onClick={()=>{navigate('/settings')}} className="cms-account-student-additional">
              <Settings className='cms-account-icon'/>
              <p className='cms-account-important-title'>Settings</p>
          </div>

          <div onClick={logout} className="cms-account-student-additional">
              <Logout className='cms-account-icon'/>
              <p className='cms-account-important-title'>Logout</p>
          </div>

        </div>        

      </div>

  
    </div>
  )
}

export default Account