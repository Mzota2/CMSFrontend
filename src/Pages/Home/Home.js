import React, { useEffect, useState } from 'react'
import image1 from '../../Assets/image1.jpg';
import image2 from '../../Assets/image2.jpg';
import image3 from '../../Assets/image3.jpg';

import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModules } from '../../State/StudentsSlice';
import { getModules } from '../../State/ModulesSlice';
import Loader from '../../Components/Loader/Loader';
import robotImage from '../../Assets/robot.jpg';
import engineeringGirl from '../../Assets/engineeringGirls.jpg';
import { getPrograms } from '../../State/ProgramsSlice';

import {Engineering, ExpandMore, ExpandLess, Check, Clear} from '@mui/icons-material'

function Home() {

    //HIDE AND SHOW SECTIONS

    const [showProjects, setShowProjects] = useState(true);
    const [showEvents, setShowEvents] = useState(true);
    const [showToday, setShowToday] = useState(true);

    //
    const [isLoading, setIsLoading] = useState(false);

    //date and time
    const days = ['Sunday,Monday, Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const date = new Date();
    const [ today, setToday]= useState();
    
     //programs status
     const foundPrograms = useSelector(state => state.programs.data);
     const programsStatus = useSelector(state => state.programs.status);
     const [program, setProgram] = React.useState();

    //floating action bt
   
    //modules
    const foundModules = useSelector(state => state.modules.data);
    const moduleStatus = useSelector(state => state.modules.status);
    const [todayModule, setTodayModule] = useState();
    const [activeModule, setActiveModule] = useState();
    const [displayActiveModule, setDisplayActiveModule] = useState(false);


    const [assignments, setAssignments] = useState();
    const [exams, setExams] = useState();

    const [index, setIndex] = React.useState(1);
    const dispatch = useDispatch();

    const [modules, setModules] = useState();
 
    //active user
    const activeUser = useSelector(state => state.students.activeUser);

   
    //collapse section
    
    function handleDisplayProjects(){
      setShowProjects(prev => !prev);
    }

    function handleDisplayEvents(){
      setShowEvents(prev => !prev);
    }

    function handleDisplayToday(){
      setShowToday(prev => !prev);
    }


    //handle view animation background image
    const [homeAnimeIndex, setHomeAnimeIndex] = useState(1);

    //function set interval

    function handleAnimation(){
      setTimeout(()=>{
        if(homeAnimeIndex <2){
          setHomeAnimeIndex(prev => prev+1);
        }
        else{
          setHomeAnimeIndex(0);
        }
        
      }, 60000)
    }

    function handleSelectModule(id){
      console.log('clicked');
      setDisplayActiveModule(prev => !prev);
      const selectedModule = modules?.find((md)=> md?._id === id);
      setActiveModule(selectedModule);
    }

    React.useEffect(()=>{

        if(programsStatus === 'idle'){
          dispatch(getPrograms());
        }
        else if(programsStatus !== 'idle' ){
          const userProgram = foundPrograms?.find((program)=> program._id === activeUser?.program);
          setProgram(userProgram);
        }

        if(moduleStatus === 'idle'){
            setIsLoading(true)
            dispatch(getModules());
        }

        else if((moduleStatus !== 'idle') && activeUser){
            setIsLoading(false);
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


            setTodayModule(foundToday);
            setAssignments(foundAssignments);
            setExams(foundExams);

            //set my modules
            const myModules = activeUser?.modules?.map((myModule)=>{
                const existingModule = foundModules?.find(md => md._id === myModule);
                if(existingModule){
                  return existingModule;
                }
               
              })?.filter((md)=> md); //check if its defined
              
             setActiveModules(myModules);
             }
        
            if(activeUser){

                //dispatch everything that belongs to the user
                const myModules = foundModules?.filter((md)=>{
                    return activeUser?.modules?.find(activeMd => activeMd === md?._id);
                  })
                  setModules(myModules);
              
                dispatch(setActiveModules(myModules))
                
            }

            setToday(days[date.getDay()]);



    }, [index, dispatch,moduleStatus, foundModules, foundPrograms, programsStatus]);


    useEffect(()=>{
      handleAnimation();
    }, [homeAnimeIndex])

    if(isLoading){
        return <Loader show={!isLoading}/>
    }

  return (
    <div className=''>

        <div className="home-image-container">

          <div className="cms-home-welcome-engineer">
            <Engineering className='cms-home-engineering-icon' />
            <h4 className='cms-home-engineer-text'>
              {
              program?.code === 'BECE'?'Computer Engineer':
              program?.code === 'BETE'? 'Telecommunication Engineer':
              program?.code === 'BBME'? 'Biomedical Engineer':
              program?.code === 'BEEE'? 'Electrical Engineer':''
              }
            
            </h4>
          </div>

          <div style={{display:`${homeAnimeIndex === 0? 'flex':'none'}`}} className="cms-home-message-container">
            
            <div className="cms-home-message-image-container">
              <img className='home-image' src={image1} alt="back" />
            </div>

            <div className="cms-home-text-container">
              <div className="cms-engineering-mindset">
                <h1 className='cms-home-message'>THE ENGINEERING MINDSET</h1>
              </div>
              
              <p className='cms-home-message-quote'>“I have not failed, but found 1000 ways to not make a light bulb.”</p>
              <p className='cms-home-message-author'>Thomas Edison</p>
            </div>
        
          </div>

          <div style={{display:`${homeAnimeIndex === 1? 'flex':'none'}`}}  className="cms-home-message-container">
            <div className="cms-home-message-image-container">
              <img className='home-image' src={image2} alt="back" />
            </div>

            <div className="cms-home-text-container">
              <div className="cms-engineering-mindset">
                <h1 className='cms-home-message'>CREATIVITY & INNOVATION</h1>
      
              </div>
              
              <p className='cms-home-message-quote'>“If at first the idea is not absurd, then there is no hope for it.“</p>
              <p className='cms-home-message-author'>Albert Einstein</p>
            </div>
        
          </div>

          <div style={{display:`${homeAnimeIndex === 2? 'flex':'none'}`}}  className="cms-home-message-container">
            <div className="cms-home-message-image-container">
              <img className='home-image' src={image3} alt="back" />
            </div>

            <div className="cms-home-text-container">
              <div className="cms-engineering-mindset">
                <h1 className='cms-home-message'>HUMANITARIAN IMPACT</h1>
               
              </div>
              
              <p className='cms-home-message-quote'>“Life’s most persistent and urgent question is, ‘What are you doing for others?’”</p>
              <p className='cms-home-message-author'> Martin Luther King Jr</p>
            </div>
        
          </div>

          <div className="home-background-overlay"> </div>

        </div>

        

        <div className="cms-home-todays-classes-container cms-home-section">

          <div className="cms-home-section-button">
            
            <h3 className='cms-home-section-title'>Today's Classes</h3>

            <div onClick={handleDisplayToday} className="cms-home-expand-container">
             { !showToday? <ExpandMore className='cms-home-expand-icon'/>:<ExpandLess className='cms-home-expand-icon'/>}
            </div>

          </div>

         { showToday &&<div className="cms-home-todays-classes">
            {
              todayModule?.map((md)=>{

                console.log(md);

                const isActive = !md?.isCancelled;
                return(
                  <div key={md?._id} className="cms-home-today" onClick={()=>{handleSelectModule(md?._id)}}>

                    <div className="cms-home-today-details">
                      <p className='cms-today-name'>{md?.name}</p>
                      <p className='cms-today-code'>{md?.code}</p>
                      <p className='cms-today-lecturer'>{md?.lecturer}</p>

                      <div style={{backgroundColor:`${isActive?'green':'red'}`}} className="cms-today-isActive">
                          {isActive ? <Check/>:<Clear/>}
                      </div>
                    </div>

                    {displayActiveModule && md?._id === activeModule?._id &&

                    <div className="cms-home-today-more-info">
                    {
                 
                
                      
                        activeModule?.classDays?.map((dy, idx)=>{
                          return(
                          <div key={idx} className="cms-module-dy cms-module-dy-home">
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
              })
            }
          </div>}

       

        </div>

       <div className="cms-home-projects-innovations-container cms-home-section">

          <div className="cms-home-section-button">
              
              <h3 className='cms-home-section-title'>Projects & Innovations</h3>

              <div onClick={handleDisplayProjects} className="cms-home-expand-container">
                {!showProjects?<ExpandMore className='cms-home-expand-icon'/>:<ExpandLess className='cms-home-expand-icon'/>}
              </div>

          </div>


          {showProjects && <div className="cms-projects-innovations">
            {
              [1,2,3, 4,5,6].map((project, index)=>{
                return(
                  <div key={index} className="cms-home-project">

                    <div className="cms-project-image-container">
                      <img src={robotImage} className='cms-project-image' alt="robot" />
                    </div>

                    <div className="cms-project-details">
                      <h4 className="cms-project-title">
                        MUBAS Engineering Students Inver a Robot
                      </h4>

                      <p>According to our sources the robot...</p>


                    </div>

                    <button className='cms-btn cms-projects-btn'>Read more</button>

                  </div>
                )
              })
            }
          </div>}
        </div>
        
        
       <div className="cms-home-events-activities-container cms-home-section">
            <div className="cms-home-section-button">
                
                <h3 className='cms-home-section-title'>Events & Activities</h3>

                <div onClick={handleDisplayEvents} className="cms-home-expand-container">
                  {!showEvents?<ExpandMore className='cms-home-expand-icon'/>:<ExpandLess className='cms-home-expand-icon'/>}
                </div>

            </div>
        {
            showEvents && <div className="cms-projects-innovations">
          {
            [1,2,3,4,5,6].map((project, index)=>{
              return(
                <div key={index} className="cms-home-project">

                  <div className="cms-project-image-container">
                    <img src={engineeringGirl} className='cms-project-image' alt="robot" />
                  </div>

                  <div className="cms-project-details">
                    <h4 className="cms-project-title">
                      WomEng workshop shines spot light on leadership skills among female engineers
                    </h4>

                    <p>According to our sources the robot...</p>


                  </div>

                  <button className='cms-btn cms-projects-btn'>Read more</button>

                </div>
              )
            })
          }
          </div>
        }
        </div>
        <br />
        <br />

        <hr className='footer-line'/>

        <div className="cms-footer">
         

          <p className='copyright'>© Electrical Department CMS 2024</p>
        </div>



    </div>
  )
}

export default Home