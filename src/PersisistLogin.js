
import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar'
import { useDispatch, useSelector } from 'react-redux'

function PersisistLogin() {
    const activeStudent = useSelector(state => state.students.activeUser);
    const studentStatus = useSelector(state => state.students.status);
    const [isActive, setIsActive] = React.useState();
    const dispatch = useDispatch();
    React.useEffect(()=>{
      setIsActive(activeStudent)
    }, [activeStudent]);
  
    return(
        <div>
            {/* {isActive? <Outlet/>:<Navigate to={'/signin'}/>} */}
            <Outlet/>
        </div>
        
    )
 
}

export default PersisistLogin