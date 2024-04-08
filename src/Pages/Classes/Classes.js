import React, { useState } from 'react';
import './Classes.css';
import { Link } from 'react-router-dom';
import SubNav from '../../Components/SubNav/SubNav';
import {useDispatch, useSelector} from 'react-redux';
import {getModules} from '../../State/ModulesSlice';
import axios from 'axios';
import { appUrl } from '../../Helpers';

import teacherAnime from '../../Assets/teacher.mp4';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Loader from '../../Components/Loader/Loader';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

function Classes() {

  //tab
  const [activeTab, setActiveTab] = useState('All');

  //dispatch
  const dispatch = useDispatch();

  const [activeModule, setActiveModule] = React.useState();
  const [displayActiveModule, setDisplayActiveModule] = React.useState(false);


  //student
 // const [user, setUser] = React.useState();
  const activeUser = useSelector((state)=> state.students.activeUser);
  const activeUserModules = useSelector(state => state.students.modules);

  //modules
  const foundModules = useSelector(state => state.modules.data);
  const modulesStatus = useSelector(state => state.modules.status);
  const [modules, setModules] = React.useState();


  function handleActiveTab(e){

    const days = ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const day = date.getDay();

    if(e.target.innerText === 'Active'){
      const activeModules = foundModules?.filter((md)=>{
        const isDay = md?.classDays?.find((dy)=> dy.day === days[day]);
        const isOn = md?.classDays?.find((dy)=> dy.isCancelled === false);
        return isDay && isOn;
      });

      setModules(activeModules);
    }

    else if(e.target.innerText === 'Cancelled'){
      const cancelledModules = foundModules?.filter((md)=>{
        const isDay = md?.classDays?.find((dy)=> dy.day === days[day]);
        const isOn = md?.classDays?.find((dy)=> dy.isCancelled === false);
        return isDay && !isOn;
      });

      setModules(cancelledModules);


    }

    else if(e.target.innerText === 'All'){
      setModules(foundModules);
    }

    setActiveTab(e.target.innerText);

  }

  function handleSelectModule(id){
    console.log('clicked');
    setDisplayActiveModule(prev => !prev);
    const selectedModule = modules?.find((md)=> md?._id === id);
    setActiveModule(selectedModule);
  }

  async function updateStudentModule(id, module){
    try {
      const response = await axios.put(`${appUrl}module/${id}`, {...module});
      const {data} = response;
      console.log(data);
      dispatch(getModules());
      
    } catch (error) {
      console.log(error);
    }
  }

  async function setClassOnOff(id, bool){
    let selectedModule = modules?.find((md)=> md?._id === id);
    console.log('this is the module');
    console.log(selectedModule);
    setActiveModule(selectedModule);

    //set active module above
    const days = ['Sunday','Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const day = date.getDay();
    const today = days[day];

    console.log(today);

    let updateModule = selectedModule?.classDays?.find((dy)=> dy.day === today);

    console.log(updateModule);
    const result = {...updateModule};
    if(updateModule){
      result.isCancelled = !bool;
      const index = selectedModule?.classDays?.indexOf(updateModule);

      const moduleClassDays = [...selectedModule?.classDays];
      moduleClassDays[index] = result;

      const module = {...selectedModule, classDays:moduleClassDays};
      console.log(module);

      updateStudentModule(id, module); //updated class module
    }
  
    //updateModules(id, selectedModule);
    

  }

  React.useEffect(()=>{

    //user
   
    // setUser(activeUser);
    if(modulesStatus === 'idle'){
        dispatch(getModules());
    }

    else if(modulesStatus !== 'idle' && activeUserModules){
      setModules(activeUserModules);

    }

  }, [dispatch, foundModules, modulesStatus, activeUser]);



  if(modulesStatus === 'idle'){
    return <Loader/>
  }

  return (
    <div>
    
        <div className="cms-students-background">

          <div className="cms-students-text">
              <h1 className='cms-students-title'>CLASSES</h1>
              <p className='cms-students-description'>Find your classes</p>
          </div>

          <div className="video-background-overlay"></div>
          <video autoPlay={true} loop={true} className='cms-student-video' src={teacherAnime}  ></video>
        </div>
    
       <div className="class-modules-container">

          <div className="class-module-tabs-container">
                    <button onClick={handleActiveTab}  className={`${activeTab === 'Active' ? 'activate-tab':'class-module-tab'} class-module-tab cms-student-classes-tab`}>
                      <Brightness1Icon className='cms-class-on-icon'/>
                      <p>Active</p>
                    
                    </button>
                    <button onClick={handleActiveTab} className={`${activeTab === 'Cancelled' ? 'activate-tab':'class-module-tab'} class-module-tab cms-student-classes-tab`}>
                      <RadioButtonUncheckedIcon className='cms-class-off-icon' />
                      <p>Cancelled</p>
                    </button>
        
                    <button onClick={handleActiveTab} className={`${activeTab === 'All' ? 'activate-tab':'class-module-tab'} class-module-tab cms-student-classes-tab`}>All</button>
                    
                    
              
            </div>

          <div className="class-modules-window">

          {modules?.map((mod)=>{
            const days = ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const date = new Date();
            const day = date.getDay();
            const today = days[day];
  
            const isDay = mod?.classDays?.find((dy)=> dy.day == today);
            const isOn = mod?.classDays?.find((dy)=> dy.isCancelled === false);

            return(
              <div className='class-module class-timetable' key={mod?._id} >

                  <h3>{mod?.name}</h3> <span className='vertical-space'>|</span>
                  <p>{mod?.code}</p><span className='vertical-space'>|</span>
                  <p className='class-module-lecturer'><strong>{mod?.lecturer}</strong></p>
                 
                 <div className="cms-module-status-container">
                  {isDay && isOn?
                  <i className="fas fa-toggle-on m-status m-status-on" onClick={()=>{setClassOnOff(mod?._id, false)}} ></i>:
                   isDay &&
                  <i className="fas fa-toggle-off m-status  m-status-off" onClick={()=>{setClassOnOff(mod?._id, true)}}></i>
                  
                }
                  
        
                 </div>

                 <div onClick={()=>{handleSelectModule(mod?._id)}} className="cms-module-expand-container">
                  {
                    displayActiveModule? <ExpandMore/>: <ExpandLess/>
                  }
                 </div>

                {
                  displayActiveModule && mod?._id === activeModule?._id &&
                  <div className="module-more-details">
                      {
                        activeModule?.classDays?.map((dy, idx)=>{
                          return(
                          <div key={idx} className="cms-module-dy">
                              <div className="cms-module-dy-info">
                              <p>{dy?.from}</p>
                              <span>-</span>
                              <p>{dy?.to}</p>
                              <p>{dy?.day}</p>
                              <p>{dy?.room}</p>
                            </div>
                            <hr className='hr-line'/>

                          </div>)
                        })
                      }
                 </div>
                }
                 
              </div>
            )
          })}

        </div>

      </div>
      
       


    </div>
  )
}

export default Classes