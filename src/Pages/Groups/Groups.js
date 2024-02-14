import React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { getStudents } from '../../State/StudentsSlice';
import { getGroups } from '../../State/GroupsSlice';
import axios from 'axios'

import './Groups.css';
import { appUrl } from '../../Helpers';

function Groups() {
    const [studentsText, setStudentsText] = React.useState('');
    const [generateClicked, setGenerateClicked] = React.useState(false);
    const [randomisationArray, setRandomisationArray] = React.useState();
    const [groupNumber, setGroupNumber] = React.useState(3);
    const [taskTitle, setTaskTitle] = React.useState('');
    

    const [resultGroups, setResultGroups] = React.useState();

    //get groups from api
    const foundGroups = useSelector(state => state.groups.data);
    const groupsStatus = useSelector(state => state.groups.status);
    const dispatch = useDispatch();
    const [apiGroups, setApiGroups] = React.useState();
  
    function handleChangeNumber(e){
      setGroupNumber(e.target.value)
    }

    function handleChangeTaskTitle(e){
      setTaskTitle(e.target.value)
    }

    function handleChangeInput(e){
      setStudentsText(e.target.value);
    }

    function createArray(){
      console.log(studentsText)
      if(studentsText){
          const arr = studentsText.split(',');
          
          if(arr.length > 2){
            setRandomisationArray(arr);
            setGenerateClicked(true);
            console.log(arr);
          }
      }
      else{
        console.log('no text')
      }
    }

    function toggleGenerate(){
      setGenerateClicked(prev => !prev)
    } 
  
    async function confirmGroups(){
      try {
        const response = await axios.post(`${appUrl}group`, {groups:resultGroups, task:taskTitle})
        const {data} = response;
        console.log(data);
      } catch (error) {
        
      }
    }
    function generateRandom(collection){
      return Math.floor(Math.random()*collection.length);
    }
  
    function formGroupsByStudents(collection, students){
       //numver of groups = collection.length/number
       //members num = students;
       if(collection.length > 3){
        let groupCount = 0;
        const groups = [];
        const groupNumber =Math.trunc((collection.length / students)) ;
        
        console.log(groupNumber)
        const remainder = collection.length % students;
        let newCollection = collection.slice(0, collection.length - remainder);
        const additional = collection.slice(collection.length - remainder);
       
        //remainder of participants
        //what to do
        //add them randomly to the groups
        //adding the remaining groups using another loop
    
        while(groupCount < groupNumber){
          
          let group = [];
    
          while(group.length < students){
            let randomNumber = generateRandom(newCollection);
            const foundMatch = groups.find((group)=> group.includes(newCollection[randomNumber]))
    
            if((!group.includes(newCollection[randomNumber])) && (!foundMatch)){
              group.push(newCollection[randomNumber]);
            }
            
          }
    
          groups.push(group);
          groupCount = groupCount + 1;
         
        }
       
        
          if(groupCount >= groupNumber && remainder){
   
           if(additional.length >= students -1 ){
             groups.push(additional);
           }
           else{
             var groupLength = groups.flat().length;
             console.log(groups.flat());
      
             while(groupLength < collection.length){
    
               let groupIndex = generateRandom(groups);
               let additionalIndex = generateRandom(additional);
               const foundAdditional = groups.find((group)=> group.includes(additional[additionalIndex]) );
               console.log(foundAdditional);
               if(groups[groupIndex].length < students + 1){
                  if((!groups[groupIndex]?.includes(additional[additionalIndex])) && (!foundAdditional) ){
                    groups[groupIndex].push(additional[additionalIndex]);
                  
                  }
               }
     
               
            
               groupLength = groups.flat().length;
             
             }
           }
            
    
          }
          
        
       
       
    
        setResultGroups(groups);
        console.log(groups);
       }
     
  
    }
  
    function formGroupsByGroup(collection, number){
     if(collection.length >  3){
       //numver of groups = collection.length/number
       let groupCount = 0;
       const groups = [];
       const membersNum = Math.trunc((collection.length / number)) ;
       
       console.log(membersNum)
       const remainder = collection.length % number;
       let newCollection = collection.slice(0, collection.length - remainder);
       const additional = collection.slice(collection.length - remainder);
   
       //remainder of participants
       //what to do
       //add them randomly to the groups
       //adding the remaining groups using another loop
   
       while(groupCount < number){
         
         let group = [];
   
         while(group.length < membersNum){
           let randomNumber = generateRandom(newCollection);
           const foundMatch = groups.find((group)=> group.includes(newCollection[randomNumber]))
   
           if((!group.includes(newCollection[randomNumber])) && (!foundMatch)){
             group.push(newCollection[randomNumber]);
           }
           
         }
   
         groups.push(group);
         groupCount = groupCount + 1;
        
       }
      
       
         if(groupCount === number && remainder){
           var groupLength = groups.flat().length;
           console.log(groups.flat());
           let additionalCount = 0;
           
         
           
           while(groupLength < collection.length){
             let groupIndex = generateRandom(groups);
             let additionalIndex = generateRandom(additional);
             const foundAdditional = groups.find((group)=> group.includes(additional[additionalIndex]) );
             console.log(foundAdditional);
   
             if(groups[groupIndex].length < membersNum + 1){
               if((!groups[groupIndex]?.includes(additional[additionalIndex])) && (!foundAdditional) ){
                 groups[groupIndex].push(additional[additionalIndex]);
               
               }
            }
          
             groupLength = groups.flat().length;
           
           }
   
         }
         
       
      
      
   
       setResultGroups(groups);
       console.log(groups);
     }
    }


    React.useEffect(()=>{
      if(groupsStatus === 'idle'){
        dispatch(getGroups());
      }
      else{
        setApiGroups(foundGroups);
      }

    }, [dispatch, groupsStatus])

      
  return (

    <div>
        <div className='group-creator-container'>
                <h2 className='group-creator-title'>Quick Group Creator</h2>
                <p>Enter student names separated by comma</p>
                <br />

                <textarea value={studentsText} onChange={handleChangeInput} className='group-student-field' name="studentnames" id="" cols="30" rows="10"></textarea>
                
                <br />
                <div className="group-button-container">
                  <button onClick={createArray} className='btn-generate cms-btn'>Generate</button>
                  <button onClick={confirmGroups} className='btn-confirm cms-btn'>Confirm</button>
                </div>

        </div>

        <div className="groups-container">
                  {resultGroups?.length? resultGroups.map((group, index)=>{
                    return(
                      <div key={index} className="group">
                        <h3>Group {index+1}</h3>
                        {group?.map((member, index)=>{
                          return(
                            <p key={index} className='member-title'>{member}</p>
                          )
                        })}
                      </div>
                    )
                  }):<></>}
          </div>

          {apiGroups?<div className="recent-groups-section ">
                  <h1>Recent Groups</h1>
                  
                  {apiGroups?.length? apiGroups.map((collection, index)=>{
                    return(
                      <div className='recent-groups-container' key={collection?._id}>
                        

                        <h2 className='group-task'>{collection?.task}</h2>

                        {collection?.groups?.map((group, index)=>{
                          return(
                            <div className="group recent-group">
                              <h3>Group {index+1}</h3>
                              {group?.map((member, index)=>{
                                return(
                                  <p key={index} className='member-title'>{member}</p>
                                )
                              })}
                            </div>
                          )
                          
                            
                        })}
                      </div>
                    )
                  }):<></>}

          </div>:<></>}



        {generateClicked? <div className="selection-overlay">
                  <div className='group-selection-method-container'>
                    <h3>How do you want to do this?</h3>
                    <div className="group-input-container">
                      <input value={groupNumber} onChange={handleChangeNumber} className='group-number-input' type="number" placeholder='Enter fixed group/student number'/>
                      <input value={taskTitle} onChange={handleChangeTaskTitle} className='group-number-input' type="text" placeholder='Enter Task Title'/>
                    </div>

                    <button onClick={()=>{toggleGenerate(); formGroupsByGroup(randomisationArray, groupNumber)}} className='cms-btn selection-btn'>Fixed Group Number</button>
                    <button onClick={()=>{toggleGenerate(); formGroupsByStudents(randomisationArray, groupNumber)}}  className='cms-btn selection-btn'>Fixed Students Number</button>

                  </div>

                </div>:<></>}
    </div>
   
  )
}

export default Groups