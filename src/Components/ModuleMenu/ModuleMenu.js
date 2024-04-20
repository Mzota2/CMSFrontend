import React, { useEffect } from 'react'
import'./ModuleMenu.css';
import {Add, Close, Remove, Edit, Delete, RemoveCircleOutline, AddCircleOutline} from '@mui/icons-material';

function ModuleMenu({handleAdd, display,handleDisplay, handleRemove, handleDelete, handleEdit, isFound}) {
 
    function handleDisplayOptions(){
        // if(display=== true){
        //     handleDisplay();
        // }
    }
    useEffect(()=>{
        document.addEventListener('click', ()=>{
            handleDisplayOptions();
        });

        return ()=>{
            document.removeEventListener('click', ()=>{
                handleDisplayOptions();
            })
        }
    }, [])
    return (
    <div onClick={handleDisplay} className='cms-module-menu'>
        <div className='cms-module-menu-options'>
           {isFound?<div onClick={handleAdd} className="cms-module-option-container">
                <p className="cms-module-option">Add</p>
               
            </div>:

            <div onClick={handleRemove} className="cms-module-option-container">
                <p className="cms-module-option">Remove</p>
               
            </div>}


            <div onClick={handleEdit} className="cms-module-option-container">
                <p className="cms-module-option">Edit</p>
               
                
            </div>

            
            <div onClick={handleDelete} className="cms-module-option-container">
                <p className="cms-module-option">Delete</p>

            </div>
            
        </div>


    </div>
  )
}

export default ModuleMenu