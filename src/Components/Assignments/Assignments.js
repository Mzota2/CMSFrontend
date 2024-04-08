import React, {useState} from 'react';
import './Assignments.css';
import axios from 'axios';
import {appUrl} from '../../Helpers'
import {Close, Brightness1, ArrowDropDown, ArrowDropUp, Add} from '@mui/icons-material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';


function Assignments({assignmentModules, modules, handleClose}) {

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

    function handleEnlarge(){
        setEnlarge(prev => !prev);
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
                console.log(data);
            }
            
        } catch (error) {
            console.log(error);
        }

       

    
    }

    //assignments
    
  return (
    <div className='cms-today-outer-container'>
      

      <div className='cms-today-inner-container'>

        <div style={{zIndex:1}} onClick={handleClose} className="close-icon-container">
                <Close className='close-icon' />
            </div>


        <div className={`${enlarge?"cms-enlarge-window":"cms-minimise-window"} cms-today-main-container`}>

            <div className="cms-assign-tabs">
                <h3 className='cms-assign-title'>Assignments</h3>
                <div onClick={handleShowAdd} className="cms-add-assign-btn cms-btn">
                    {
                        showAdd? <Close className='cms-assign-add-icon' />:<Add className='cms-assign-add-icon' />
                    }
                    
                </div>
            </div>

            {
                showAdd?

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

                assignmentModules?.map((md)=>{

                        return md?.assignments?.map((assign)=>{
                            return(
                                <div className="cms-today-cls cms-assign-cls">

                                    <div className="cms--assignment-details-container">
                                        <p style={{fontSize:'.85rem'}}>{md?.code}</p>
                                        <p>{assign?.title|| assign?.task}</p>
                                        <p>{assign?.dueDate}</p>
                                        {
                                            toggleDescription?<ArrowDropUp onClick={handleToggleDescription} className='cms-assign-drop-icon'/>:<ArrowDropDown onClick={handleToggleDescription}  className='cms-assign-drop-icon'/>
                                        }
                                        <Brightness1 className='cms-class-on-icon cms-today-active-icon'/>

                                    </div>

                                    {
                                        toggleDescription?
                                        <div  className='cms-assignment-description-container'>
                                            <p>{assign?.description}</p>    
                                        </div>
                                        :<></>
                                    }

                                
                                </div>
                            )
                        })
                        
                })}
          
            <div onClick={handleEnlarge} className="cms-notice-expand-icon cms-today-exapand-icon">

                {
                enlarge?<CloseFullscreenIcon className='cms-expand-icon' />:
                <OpenInFullIcon className='cms-expand-icon' />
                }

            </div>

        </div>
        
        </div>
    </div>
  )
}

export default Assignments