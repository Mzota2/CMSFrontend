import React, { useEffect, useState } from 'react';
import "./Exams.css";
import axios from 'axios';
import { appUrl } from '../../Helpers';
import {Close, Brightness1, ArrowDropDown, ArrowDropUp, Add} from '@mui/icons-material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { useDispatch, useSelector } from 'react-redux';
import { getModules } from '../../State/ModulesSlice';
import { setActiveModules } from '../../State/StudentsSlice';
import SubNav from '../../Components/SubNav/SubNav';

function Exams() {

    const dispatch = useDispatch();
      //modules
    const foundModules = useSelector(state => state.modules.data);
    const moduleStatus = useSelector(state => state.modules.status);


    //active user
    const activeUser = useSelector(state => state.students.activeUser);
    const [assignments, setAssignments] = useState();
    const [exams, setExams] = useState();
    const activeModules = useSelector(state => state.students.modules);
    const [modules, setModules] = useState();
      

    const [newExam, setNewExam] = useState({
        title:"",
        date:"",
        time:{from:"", to:""},
        description:""
    });

    //assignment-description
    const [toggleDescription, setToggleDescription] = useState(false);

    //enlarge
    const [enlarge, setEnlarge] = useState(false);

     //add assign
     const [showAdd, setShowAdd] = useState(false);

    function handleShowAdd(){
        setShowAdd(prev => !prev);
    }
    function handleToggleDescription(){
        setToggleDescription(prev => !prev);
    }

    function handleChange(e){
        setNewExam(prev =>{
            return {
                ...prev,
                [e.target.name]:e.target.value
            }
        })

    }

    function handleChangeTime(e){
        setNewExam(prev =>{
            let newTime= {
                [e.target.name]:e.target.value
            };

            return {
                ...prev,
                time:{...prev.time, ...newTime}
            }
        })
    }

    async function createExam(e){
        e.preventDefault();

        if(newExam?.title){
            const response = await axios.put(`${appUrl}module/${newExam?.title}`, {exams:{
                date:newExam.date, time:newExam.time, description:newExam.description}
            });
            const {data} = response;
        }
    }

    useEffect(()=>{
        if(moduleStatus === 'idle'){
            dispatch(getModules());
        }


        else if((moduleStatus !== 'idle') && activeUser){
         
            const days = ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const date = new Date();
            const day = date.getDay();
           
            const foundToday = foundModules?.filter((module)=>{
                const isToday = module?.classDays?.find(cls => cls?.day === days[day]);
                if(isToday){
                    return isToday;
                }
            });

            const foundExams = foundModules?.filter((module)=>{
                return module?.exams?.length;
            })

            const foundAssignments = foundModules?.filter((module)=>{
                return module?.assignments?.length;
            })


         
            setAssignments(foundAssignments);
            setExams(foundExams);
        }

        if(activeModules){
            setModules(activeModules);
        }


    }, [dispatch, moduleStatus, foundModules, activeModules])
  return (

    <div>
        <SubNav/>

        <br />
        <br />

        <div className='cms-today-outer-container'>

        <div className='cms-today-inner-container'>

        <div className={`cms-today-main-container`}>
            
            <div className="cms-assign-tabs">
                <h3 className='cms-assign-title'>Exams</h3>
                {activeUser?.isClassRep && <div onClick={handleShowAdd} className="cms-add-assign-btn cms-btn">
                    {
                        showAdd? <Close className='cms-assign-add-icon' />:<Add className='cms-assign-add-icon' />
                    }
                    
                </div>}
            </div>

            {
                showAdd & activeUser?.isClassRep?

                <form className='cms-form cms-assign-form'>
                    <select  value={newExam.title} onChange={handleChange} name="title" id="module" className='cms-input-field cms-assign-field'>
                        <option value=""></option>
                        
                        {modules?.map((md)=>{
                            return(
                                <option value={md?._id}>
                                    {md?.name}
                                </option>
                            )
                        })}
                    </select>

                    <input value={newExam.description}  onChange={handleChange} name='description' type="text" placeholder='Enter description' className='cms-input-field cms-assign-field' />
                    
                    <div className="cms-exam-time-fields">
                        
                        <input value={newExam.time.from} onChange={handleChangeTime} name="from" type="time" className='cms-input-field cms-assign-field' />
                        
                        <span style={{fontSize:"2rem"}}>:</span>
                        <input value={newExam.time.to} onChange={handleChangeTime} name='to' type="time" className='cms-input-field cms-assign-field' />

                    </div>
                
                    <input value={newExam.date}  onChange={handleChange} name="date" type="date" className='cms-input-field cms-assign-field' />
                        
                    <button onClick={createExam} className='cms-btn cms-create-assign-btn'>Create</button>
                
                </form>:

                exams?.map((md)=>{

                    return md?.exams?.map((exam, index)=>{
                        return(
                            <div key={index} className="cms-today-cls  cms-assign-cls">

                                <div className="cms--assignment-details-container">
                                    <p>{md?.name}</p>
                                    <p>{exam?.title}</p>
                                    <p>{exam?.date}</p>
                                    <p>{exam?.time?.from}- {exam?.time?.to}</p>
                                    
                                    <Brightness1 className='cms-class-on-icon cms-today-active-icon'/>


                                </div>

                             
                                
                            </div>
                        )
                    })

                    
                })
            }

        </div>

        </div>
        </div>

    </div>
  
  )
}

export default Exams