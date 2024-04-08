import React, { useState } from 'react';
import "./Exams.css";
import axios from 'axios';
import { appUrl } from '../../Helpers';
import {Close, Brightness1, ArrowDropDown, ArrowDropUp, Add} from '@mui/icons-material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

function Exams({examModules, modules, handleClose}) {
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

    function handleEnlarge(){
        setEnlarge(prev => !prev);
    }


    async function createExam(e){
        e.preventDefault();
        console.log(newExam);

        if(newExam?.title){
            const response = await axios.put(`${appUrl}module/${newExam?.title}`, {exams:{
                date:newExam.date, time:newExam.time, description:newExam.description}
            });
            const {data} = response;
            console.log(data);
        }

    
    }
  return (
    <div className='cms-today-outer-container'>

        <div className='cms-today-inner-container'>

            <div style={{zIndex:1}} onClick={handleClose} className="close-icon-container">
                <Close className='close-icon' />
            </div>

         <div className={`${enlarge?"cms-enlarge-window":"cms-minimise-window"} cms-today-main-container`}>
            
            <div className="cms-assign-tabs">
                <h3 className='cms-assign-title'>Exams</h3>
                <div onClick={handleShowAdd} className="cms-add-assign-btn cms-btn">
                    {
                        showAdd? <Close className='cms-assign-add-icon' />:<Add className='cms-assign-add-icon' />
                    }
                    
                </div>
            </div>

            {
                showAdd?

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

                examModules?.map((md)=>{

                    return md?.exams?.map((exam, index)=>{
                        return(
                            <div key={index} className="cms-today-cls  cms-assign-cls">

                                <div className="cms--assignment-details-container">
                                    <p>{md?.name}</p>
                                    <p>{exam?.title}</p>
                                    <p>{exam?.date}</p>
                                    <p>{exam?.time?.from}- {exam?.time?.to}</p>
                                    

                                    {
                                    toggleDescription?<ArrowDropUp onClick={handleToggleDescription} className='cms-assign-drop-icon'/>:<ArrowDropDown onClick={handleToggleDescription}  className='cms-assign-drop-icon'/>
                                    }
                                    <Brightness1 className='cms-class-on-icon cms-today-active-icon'/>


                                </div>

                                {
                                    toggleDescription?
                                    <div  className='cms-assignment-description-container'>
                                        <p>{exam?.description}</p>    
                                    </div>
                                    :<></>
                                }
                                
                            </div>
                        )
                    })

                    
                })
            }

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

export default Exams