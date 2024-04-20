
import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SignIn from './Pages/SignIn/SignIn';
import Loader from './Components/Loader/Loader';

function PersisistLogin() {
    
    const activeStudent = useSelector(state => state.students.activeUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
      setIsLoading(false);
    }, [activeStudent])

    if(!activeStudent){
      return activeStudent? <Loader show={!isLoading}/>:<SignIn/>
    }
    return(
        <div>
          
            {/* {isActive? <Outlet/>:<Navigate to={'/signin'}/>} */}
            <Outlet/>
        </div>
        
    )
 
}

export default PersisistLogin