
import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function PersisistLogin() {
    
    const activeStudent = useSelector(state => state.students.activeUser);

    if(!activeStudent){
      return <div className='login-back'>
        <h1 className='log-back-in-text'>Log Back In</h1>
        <Link to={'/signin'}><button className='cms-btn login-btn'>Login</button></Link>
      </div>
    }
  
    return(
        <div>
            {/* {isActive? <Outlet/>:<Navigate to={'/signin'}/>} */}
            <Outlet/>
        </div>
        
    )
 
}

export default PersisistLogin