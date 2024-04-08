import React from 'react'
import { Outlet, Navigate, Link } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar'
import { useDispatch, useSelector } from 'react-redux'

function Dashboard() {
  const activeStudent = useSelector(state => state.students.activeUser);

  if(!activeStudent){
    return <div className='login-back'>
      <h1 className='log-back-in-text'>Log Back In</h1>
      <Link to={'/signin'}><button className='cms-btn login-btn'>Login</button></Link>
    </div>
  }
  return (
    <div>
        <NavBar/>
        <Outlet/>
    </div>
  )
}

export default Dashboard