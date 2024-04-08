import React,{useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { getStudents, setActive, setActiveModules } from '../../State/StudentsSlice';
import { getGroups } from '../../State/GroupsSlice';
import axios from 'axios'

import './Groups.css';
import { appUrl } from '../../Helpers';
import { getModules } from '../../State/ModulesSlice';
import SubNav from '../../Components/SubNav/SubNav';
import groupsImage from '../../Assets/groups.jpg';
import {animated, } from '@react-spring/web'
import {Parallax, ParallaxLayer, IParallax} from '@react-spring/parallax'
import { Link } from 'react-router-dom';
import {Close, ArrowBack, ArrowForward} from '@mui/icons-material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { useRef } from 'react';
import Loader from '../../Components/Loader/Loader';

function Groups() {

    const [isLoading, setIsLoading] = useState(false);

    const [assignPage, setAssignPage] = useState({
      index:0,
      page:1
    })
      const [groupsPage, setGroupsPage] = useState({
        startIndex:0,
        endIndex:6,
        page:1
    })


    //parallax
    const parallax = useRef(null);

    // students state
    const [studentsText, setStudentsText] = React.useState('');
    const [generateClicked, setGenerateClicked] = React.useState(false);
    const [randomisationArray, setRandomisationArray] = React.useState();
    const [groupNumber, setGroupNumber] = React.useState(3);
    const [taskTitle, setTaskTitle] = React.useState('');
    const [showReps, setShowReps] = React.useState(false);

    //group reps
    const [groupReps, setGroupReps] = React.useState([]);
    const [groupMembers, setGroupMembers] = React.useState();
    const [resultGroups, setResultGroups] = React.useState([]); //final groups

    //module

    const foundModules = useSelector(state => state.modules.data);
    const modulesStatus = useSelector(state => state.modules.status);
    const [modules, setModules] = React.useState();
    const [selectedModule, setSelectedModule] = React.useState('');


    //user has module
    const activeStudent = useSelector(state => state.students.activeUser);
    const foundStudents = useSelector(state => state.students.data);
    const studentsStatus = useSelector(state =>state.students.status);
    const studentModules = useSelector(state => state.students.modules);
    const [moduleStudents, setModuleStudents] = React.useState();



    //get groups from api
    const foundGroups = useSelector(state => state.groups.data);
    const groupsStatus = useSelector(state => state.groups.status);
    const dispatch = useDispatch();
    const [apiGroups, setApiGroups] = React.useState();

    //handles selected module

    function handleSelectedModule(e){
      console.log('set');
      setSelectedModule(e.target.value)
    }
  
    function handleChangeNumber(e){
      setGroupNumber(e.target.value)
    }

    function handleChangeTaskTitle(e){
      setTaskTitle(prev => e.target.value)
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

    function filterGroups(id){
      const foundModule = modules?.filter((md)=>{
        return md?._id === id;
      });

      setApiGroups(foundModule);
    }
  
    async function confirmGroups(){
      try {
        const group = {groups:resultGroups, task:taskTitle, moduleId:selectedModule, type:'group'};
        console.log(selectedModule);
        
        const response = await axios.put(`${appUrl}module/${selectedModule}`, {assignments:group})
        const {data} = response;

        console.log(data);
        
      } catch (error) {
        console.log(error);
      }
    }
    function generateRandom(collection){
      return Math.floor(Math.random()*collection.length);
    }


    function handleShowReps(){
      setShowReps(prev => !prev);
    }

    
    function addRep(collection, reps){
     
      if(reps?.length === collection?.length){
        let count = 0;

        const maxMembers = collection[0].length + 1;
      
        let isDone = false;

        while(count < collection.length){
  
          let currentGroup = collection[count];
          const groupLength = currentGroup?.length + 1;
          
         
          while((currentGroup?.length < groupLength) && !isDone){
           
            let randomIndex = Math.floor(Math.random() * reps.length);
            let rep = reps[randomIndex];
            const foundMatch = collection.find((group)=> group.includes(rep))
        
            if((!currentGroup.includes(rep)) && (!foundMatch)){
              currentGroup.push(rep);
            }
  
            console.log(randomIndex);
            isDone = collection?.flat()?.length >= moduleStudents?.length? true:false;
  
          }
       
          isDone = collection?.flat()?.length >= moduleStudents?.length? true:false;
          console.log(isDone);
          count = count + 1;
        
        }


        return collection;
      }

      else{
        window.alert(`Please select ${collection.length} students`);
        return [];
      }

    
   
    }
  
    function formGroupsByStudents(collection, students){
       //numver of groups = collection.length/number
       //members num = students;

       
       if(collection?.length > 3){
        let groupCount = 0;
        const groups = [];
        const groupNumber = Math.trunc((collection.length / students)) ;
        
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

          console.log(groups);

          
          const finalG = [...addRep(groups, groupReps)];
          setResultGroups(finalG);
          console.log(finalG)
          
  
        }
          
       }
       else{
        window.alert('You have inadequate number of students to form groups')
       }
     
  
    }

  
    function formGroupsByGroup(collection, number){
     
     if(collection?.length >  3){
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

        const finalG = [...addRep(groups, groupReps)];
      
        setResultGroups(finalG);

      }
     }

     else{
      window.alert('You have inadequate number of students to form groups')
     }

     
    }

    function handleSelectRep(student){
      const foundRep = groupReps?.find((rep)=> rep?._id === student?._id);

      console.log('clicked');
     
      if(foundRep){
        const index = groupReps?.indexOf(foundRep);
        groupReps?.splice(index, 1);
        const currentReps = groupReps?.filter((rep, ind)=> ind === index);
        setGroupReps(prev =>{
          return [...currentReps];
        });
    
      }

      else{

        //
        console.log('current members');
        setGroupReps(prev => {
          return [...prev, student]
        });
    }
  }

  function handlePagerBackward(){
    
      if(groupsPage.endIndex>6){
        console.log("clicked backward")
        setGroupsPage(prev =>{
              
            return{
                  ...prev,
                  page:prev.page-1,
                  startIndex:prev.startIndex-6,
                  endIndex:prev.endIndex-prev.startIndex>6?prev.endIndex-6: prev.endIndex-(prev.endIndex - prev.startIndex)
              }
          })
      }
  }

  function handlePagerForward(){
    //
    console.log(apiGroups);
      const groupsNum =  apiGroups[assignPage.index].groups?.length;
      console.log(groupsNum);
      
      if(groupsPage.endIndex < groupsNum){
        console.log("clicked forward")
        
        setGroupsPage(prev =>{
              return{
                  ...prev,
                  page:prev.page+1,
                  startIndex:prev.endIndex,
                  endIndex:groupsNum - prev.endIndex >= 6? prev.endIndex+6: groupsNum
              }
          })
      }

  }

  //select module
  function handleModuleGroups(id){

    const selectedModule = apiGroups?.find((md)=> md?._id === id);
    if(selectedModule){
      const index = apiGroups?.indexOf(selectedModule);
      setAssignPage(prev =>{
        return {
          ...prev,
          index
        }
      });
    }
  
  }

    React.useEffect(()=>{
      if(groupsStatus === 'idle'){
        dispatch(getGroups());
      }
    
      if(modulesStatus === 'idle'){
        setIsLoading(true)
        dispatch(getModules());
        
      }

      else if (modulesStatus !== 'idle'){
        setIsLoading(false);
        setModules(foundModules);
      }

      if(studentsStatus === 'idle'){
        setIsLoading(true)
        dispatch(getStudents())
      }

      else if(studentsStatus !== 'idle'){
        setIsLoading(false);
        const students = foundStudents?.map((student)=>{
          const foundStd =  student?.modules?.find((md)=> md === selectedModule);
          if(foundStd){
            return student;
          }
        }).filter((std)=> std);

        setModuleStudents(students);
        setGroupMembers(students);

      }

      if(moduleStudents?.length){
        setGroupMembers((prev)=>{
          const allMembers = moduleStudents?.filter((student)=>{
            return !groupReps.find(rep => rep === student );
          });
  
          return allMembers;
          
        });

      }
      
      if(studentModules){
        
        const foundModuleGroups = studentModules?.filter(md =>{
          
          const foundGroups = md?.assignments?.find((assign)=>{
            return assign?.type === 'group';
            
          });

          if(foundGroups){
            return md;
          }
          
        });

        
        setApiGroups(foundModuleGroups);
      }

      if(activeStudent){
        //dispatch everything that belongs to the user
        const myModules = foundModules?.filter((md)=>{
          return activeStudent?.modules?.find(activeMd => activeMd === md?._id);
        })
    
        dispatch(setActiveModules(myModules))
      }


    }, [dispatch, groupsStatus, foundStudents, foundModules, selectedModule, resultGroups, taskTitle, studentsStatus, modulesStatus, groupReps, activeStudent])

      

  if(isLoading){
    return <Loader/>
  }
  return (
    
      <div>

       

          {/* <div className='group-creator-container'>
                  <h2 className='group-creator-title'>Quick Group Creator</h2>
                  <p>Enter student names separated by comma</p>
                  <br />

                  <textarea value={studentsText} onChange={handleChangeInput} className='group-student-field' name="studentnames" id="" cols="30" rows="10"></textarea>
                  
                  <br />
                

          </div> */}
          
          {/* <SubNav/> */}

          <Parallax ref={parallax} pages={3}>

            <ParallaxLayer offset={0} speed={0}>
              <div className="cms-group-landing-section">

                <div className="sub-c-nav-container">
                  <Link to={'/'} className="sub-logo-container">
                        <h1 className='logo-title'>CMS</h1>
                        <p>Electrical Department D2</p>
                  </Link>
                </div>

                <div className="cms-group-landing-container">
                    <div className="cms-group-landing-text">
                        <h1>Create Random Groups</h1>
                        <p>Remove all sources of bias and promote synergy</p>
                        
                        <div className="cms-group-navigate-groups-container">
                          <button  onClick={() => parallax.current.scrollTo(1)} className='cms-btn cms-start-create-btn'>Get started</button>
                          <button onClick={() => parallax.current.scrollTo(2)} className='cms-btn cms-view-groups'>View Groups</button>
                        </div>
                      
                    </div>

                    <div className="cms-group-landing-image-background">
                        <img className='cms-group-image' src={groupsImage} alt="group" />
                    </div>
                </div>

                

              </div>
            </ParallaxLayer>

            <ParallaxLayer offset={0.87} speed={0.8}>
              <div className="cms-group-container">
              
              <div className="cms-group-menu-options">
              

              <select onChange={handleSelectedModule} value={selectedModule} name="modules" id="modules" className='cms-field cms-select-module-field'>
                <option value="">Select module</option>
                {
                  modules?.map((md)=>{
                    return (
                      <option value={md?._id}>{md?.code}</option>
                    )
                  })
                }
              </select>

              <button onClick={handleShowReps} className='cms-btn cms-select-rep-btn'>Select Reps</button>


              <div className='cms-group-reps-menu'>

              {showReps?<div className="cms-group-reps-selections">
                <div style={{alignSelf:"center"}} onClick={handleShowReps} className="close-icon-container">
                        <Close className='close-icon' />
                </div>
              {
                    moduleStudents?.map((member)=>{

                      const isChecked = groupReps.find(rep => rep === member);

                      return (
                        <div className="cms-group-rep-option">
                            <p value={member?._id}>{member?.username}</p>
                            <button className={`cms-btn ${isChecked? 'cms-group-rep-btn':'cms-group-member-btn'}`}  onClick={()=>{handleSelectRep(member)}} >{`${isChecked? 'Rep': 'Select'}`}</button>
                        </div>
                      
                      )
                    })
                  }
              </div>:<></>}
              </div>
            
              </div>


              <div className="cms-groups-process-container">
                <div className='group-selection-method-container'>
                  <p className='cms-select-method-text'>Select method to create</p>

                  <div className="cms-group-selection-main-container">

                    <div className="group-input-container">
                      <input value={groupNumber} onChange={handleChangeNumber} className='cms-input-field group-number-input' type="number" placeholder='Enter fixed group/student number'/>
                      <input value={taskTitle} onChange={handleChangeTaskTitle} className='cms-input-field group-number-input' type="text" placeholder='Enter Task Title'/>
                    </div>

                    <div className="cms-random-method-container">
                      <button onClick={()=>{toggleGenerate(); formGroupsByGroup(groupMembers, groupNumber)}} className='cms-btn selection-btn cms-fixed-group-selection-btn'>
                        <ShuffleIcon className='cms-shuffle-icon'/>
                        <p>By Group</p>
                        
                      </button>
                      <button onClick={()=>{toggleGenerate(); formGroupsByStudents(groupMembers, groupNumber)}}  className='cms-btn selection-btn cms-fixed-student-selection-btn'>
                        <ShuffleIcon className='cms-shuffle-icon'/>
                        <p>By Student</p>
                      </button>

                    </div>

                  </div>

                
                  
                  <div className="group-button-container">
                         {/* <button onClick={createArray} className='btn-generate cms-btn'>Generate</button>  */}
                        <button onClick={confirmGroups} className='btn-confirm cms-btn'>Confirm</button>
                    </div>

                </div>


                <div className="groups-container">
                            {resultGroups?.length? [resultGroups[assignPage?.index]]?.map((group, index)=>{
                              return(
                                <div key={index} className="group">
                                  <h3>Group {index+1}</h3>
                                  {group?.map((member, index)=>{
                                    return(
                                      <div key={index} className="cms-random-group-student">
                                          <p  className='member-title'>{member?.username}</p>
                                          <p  className='member-regNo'>{member?.regNO}</p>
                                      </div>
                                      
                                    )
                                  })}
                                </div>
                              )
                            }):<></>}


                            <h2 className='cms-created-appear-text'>Created groups will appear here</h2>
                </div>

              </div>

              <br />

            

              </div>
            </ParallaxLayer>


            <ParallaxLayer offset={1.5} speed={0.5}>
              <div className='cms-created-groups-container'>
                    <h2 className='cms-created-groups-title'>RECENTLY CREATED GROUPS</h2>
                    <br />

                    <div className="cms-assign-groups-module-filter">
                      {
                        modules?.map((md, index)=>{
                          return(
                            <div onClick={()=>handleModuleGroups(md?._id)} className="cms-group-module-f">
                              <p className='cms-group-module-filter-title'>{md?.code}</p>

                              <div className="cms-group-module-title-container">

                              </div>
                            </div>
                          )
                        })
                      }
                     

                    </div>



                    <div className="cms-recently-created-groups-container">
                      <br />
                        {apiGroups?.length? apiGroups[0]?.assignments?.map((groups, index)=>{
                          console.log(groups?.groups);
                          return(
                            <div className='cms-created-assignment' key={index} >
                              <h3 className='cms-task-title'>{groups?.task}</h3>

                              <div className='cms-created-assignment-groups'>
                              {groups?.groups?.map((group, index)=>{
                                
                                if(index >= groupsPage.startIndex && index <groupsPage.endIndex){
                                    
                                    return(
                                      <div key={index} className="group">
                                        
                                        <h3 style={{color:"black"}}>Group {index+1}</h3>
                                        <br />
                                        {
                                          group?.map((member, index)=>{
                                            return(
                                              <div key={index} className="cms-random-group-student">
                                                  <p  className='member-title'>{member?.username}</p>
                                                   <p  className='member-regNo'>{member?.regNO}</p> 
                                              </div>
                                              
                                            )
                                          })
                                        }
                                      </div>
                                    )
                                }
                                
                              
                              })}
                              </div>

                              <div className="cms-students-page-num">
                                  {
                                      groupsPage.page
                                  }
                              </div>

                              <div className="cms-students-container-pager-tabs">
                                <button onClick={handlePagerBackward} className='cms-btn'>
                                    <ArrowBack />
                                </button>
                                <button onClick={handlePagerForward} className='cms-btn'>
                                    <ArrowForward className='' />
                                </button>
                              </div>
                                    
                            </div>
                          )
                        }):<></>}
                    </div>

              </div>
            </ParallaxLayer> 


          </Parallax>
       
      </div>



    
   
  )
}

export default Groups