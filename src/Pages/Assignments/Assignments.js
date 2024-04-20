import React, {useState, useEffect} from 'react';
import './Assignments.css';
import axios from 'axios';
import {appUrl} from '../../Helpers'
import {Close, Brightness1, Add} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { getModules } from '../../State/ModulesSlice';
import SubNav from '../../Components/SubNav/SubNav';

function Assignments() {

    const dispatch = useDispatch();
    //modules
    const foundModules = useSelector(state => state.modules.data);
    const moduleStatus = useSelector(state => state.modules.status);


  //active user
  const activeUser = useSelector(state => state.students.activeUser);
  const [assignments, setAssignments] = useState();
  const activeModules = useSelector(state => state.students.modules);
  const [modules, setModules] = useState();

    const [newAssignment, setNewAssignment] = useState({
        moduleId:"",
        title:"",
        dueDate:"",
        description:"",
        type:'individual'
    });

    //assignment-description
    const [toggleDescription, setToggleDescription] = useState(false);

    //add assign
    const [showAdd, setShowAdd] = useState(false);


    //enlarge
    const [enlarge, setEnlarge] = useState(false);

    function handleShowAdd(){
        setShowAdd(prev => !prev);
    }
    function handleToggleDescription(){
        setToggleDescription(prev => !prev);
    }

    function handleChange(e){
        setNewAssignment(prev =>{
            return {
                ...prev,
                [e.target.name]:e.target.value
            }
        })

    }

    async function createAssignment(e){
        e.preventDefault();
        console.log(newAssignment);

        try {

            if(newAssignment?.title){
                const response = await axios.put(`${appUrl}module/${newAssignment?.moduleId}`, {assignments:{
                   title:newAssignment.title, dueDate:newAssignment.dueDate,description:newAssignment.description}
                });
                const {data} = response;
               
            }
            
        } catch (error) {
            console.log(error);
        }

       

    
    }

    //assignments

    useEffect(()=>{
        if(moduleStatus === 'idle'){
            dispatch(getModules());
        }


        else if((moduleStatus !== 'idle') && activeUser){
         
            const days = ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const date = new Date();
            const day = date.getDay();
           

            const foundAssignments = foundModules?.filter((module)=>{
                return module?.assignments?.length;
            })

            setAssignments(foundAssignments);
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
                    <h3 className='cms-assign-title'>Assignments</h3>
                    {activeUser?.isClassRep && <div onClick={handleShowAdd} className="cms-add-assign-btn cms-btn">
                        {
                            showAdd? <Close className='cms-assign-add-icon' />:<Add className='cms-assign-add-icon' />
                        }
                        
                    </div>}
                    
                </div>

                {
                    showAdd && activeUser?.isClassRep?

                    <form className='cms-form cms-assign-form'>
                        <select  value={newAssignment.moduleId} onChange={handleChange} className='cms-input-field cms-assign-field' name="moduleId" id="module">
                            <option value=""></option>
                            
                            {modules?.map((md)=>{
                                return(
                                    <option value={md?._id}>
                                        {md?.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input value={newAssignment.title}  onChange={handleChange} name='title' type="text" placeholder='Enter title' className='cms-input-field cms-assign-field' />

                        <input value={newAssignment.description}  onChange={handleChange} name='description' type="text" placeholder='Enter description' className='cms-input-field cms-assign-field' />

                        <input value={newAssignment.dueDate}  onChange={handleChange} name="dueDate" type="date" placeholder='Select date' className='cms-input-field cms-assign-field' />
                            
                        <button onClick={createAssignment} className='cms-btn cms-create-assign-btn'>Create</button>
                    
                    </form>:

                    assignments?.map((md)=>{

                            return md?.assignments?.map((assign, index)=>{
                                return(
                                    <div key={index} className="cms-today-cls cms-assign-cls">

                                        <div className="cms--assignment-details-container">
                                            <p style={{fontSize:'.85rem'}}>{md?.code}</p>
                                            <p>{assign?.title|| assign?.task?.substring(0, 16)+'...'}</p>
                                            <p>{assign?.dueDate}</p>
                                            <Brightness1 className='cms-class-on-icon cms-today-active-icon'/>

                                        </div>


                                    
                                    </div>
                                )
                            })
                            
                    })}

            </div>
            
            </div>
        </div>

    </div>
 
  )
}

export default Assignments