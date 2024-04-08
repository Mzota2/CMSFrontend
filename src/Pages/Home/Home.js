import React, { useEffect, useState } from 'react'
import image1 from '../../Assets/image1.jpg';
import image2 from '../../Assets/image2.jpg';
import image3 from '../../Assets/image3.jpg';
import announcementLottie from'../../Lotties/announcement.json';
import { Link } from 'react-router-dom';

import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModules } from '../../State/StudentsSlice';
import Lottie from 'react-lottie'
import Exams from '../../Components/Exams/Exams';
import Assignments from '../../Components/Assignments/Assignments';
import Today from '../../Components/Today/Today';
import { getModules } from '../../State/ModulesSlice';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { current } from '@reduxjs/toolkit';
import Account from '../../Components/Account/Account';
import {ExpandLess, ExpandMore, Brightness1} from '@mui/icons-material'
import Loader from '../../Components/Loader/Loader';

function Home() {

    //
    const [isLoading, setIsLoading] = useState(false);

    //date and time
    const days = ['Sunday,Monday, Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const date = new Date();
    const isMorning = date.getHours() < 12?true:false
    const isAfternoon = date.getHours() > 12 && date.getHours()< 18? true:false;
    const isEvening = date.getHours() > 18? true:false;
    const isWeekend = date.getDay() === 6 || date.getDay() === 0 ?true:false;
    
    //floating action bt
   
    const [isExpand, setIsExpand] = useState(false);

    
    console.log(date.getDay());



    //display assignments, exams, today
    const [showToday, setShowToday] = React.useState(false);
    const [showAssignments, setShowAssignments] = React.useState(false);
    const [showExams, setShowExams] = React.useState(false);

    //animations - options
   

    //modules
    const foundModules = useSelector(state => state.modules.data);
    const moduleStatus = useSelector(state => state.modules.status);
    const [todayModule, setTodayModule] = useState();
    const [assignments, setAssignments] = useState();
    const [exams, setExams] = useState();

    const [index, setIndex] = React.useState(1);
    const dispatch = useDispatch();

    const [modules, setModules] = useState();
    const imagePaths = [image1, image2, image3];

    //set active
 
    const classNotice = ['Department T-shirts', 'Department Class Party', 'Department Trip', 'More', 'Lets see'];
    const [activeClassNotices, setActiveClassNotices] = useState(classNotice.slice(0, 3));

    //active user
    const activeUser = useSelector(state => state.students.activeUser);


    //expand floating action button
    function handleExpand(){
      setIsExpand(prev => !prev);  
    }

   
     //handle show assignments, exams and today

    
     function handleShowExams(){
        setShowAssignments(false);
        setShowExams(prev => !prev);
        setShowToday(false);
    }

    function handleShowAssignments(){
        setShowAssignments(prev => !prev);
        setShowExams(false);
        setShowToday(false);
    }

    function handleShowToday(){
        setShowToday(prev => !prev);
        setShowAssignments(false);
        setShowExams(false);
    }


    //animate change of background image
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: announcementLottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
      //function set interval

    React.useEffect(()=>{
        // const user =JSON.parse(localStorage.getItem('cms-user'));
       
        // if(user){
        //     dispatch(setActive(user));
        // }
       //set the first three

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
                    console.log(isToday);
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

        // setInterval(runAnimations, 10000);
        // runAnimations();

    }, [index, dispatch, moduleStatus, foundModules]);



    if(isLoading){
        return <Loader/>
    }

  return (
    <div className=''>
        <div className="home-image-container">

            <div className="cms-notice-board">
                <div className="class-notice-top-container">
                    <h2 className='class-announcement'>ANNOUNCEMENTS</h2>
                    <Lottie
                            options={defaultOptions}
                            height={70}
                            width={70}
                            
                        >
                    </Lottie>
                </div>
                
                <div className="cms-notice-board-container">

                    <div className="cms-notice-animation-track">

                    {classNotice?.map((notice, index)=>{
                        //console.log(randomAnimation);
        
                            return(
                                <div style={{animationDelay:`${(index+1)*100}ms`}} key={index} className={`cms-notice-container`}>
                                    <h1 className="cms-notice-title">{notice}</h1>
                                    
                                    <div className="cms-notice-date-time">
                                        <p className='cms-notice-time'>16:30pm</p>
                
                                        <p className='cms-notice-day'>30 March 2024</p>
                                    </div>
                                    
                                </div>
                            )

                       
                    })}

                    </div>
                   

                    <div className="cms-notice-expand-icon">
                        <OpenInFullIcon className='cms-expand-icon' />
                    </div>

                </div>
                
            
            </div>

            <img className='home-image' src={imagePaths[index]} alt="class" />
            

            <div className="home-background-overlay">
                
        </div>

            {showExams? <Exams modules={modules} handleClose={handleShowExams} examModules ={exams}/> :<></>}

            {showAssignments? <Assignments modules={modules} handleClose={handleShowAssignments} assignmentModules ={assignments}/>: <></>}

            {showToday? <Today todayModules ={todayModule} handleClose={handleShowToday}/> :<></>}

        
          

            <div className="cms-important-floating-buttons">

               <div onClick={handleShowExams} className={`${isExpand? 'aslideUp':'aslideDown'} cms-view-exams-floating-btn cms-mobile-floating-action-btn`}>
                    <EditNoteIcon className='cms-important-icon' />
                </div>

            

            <div onClick={handleShowAssignments} className={`${isExpand? 'aslideUp':'aslideDown'} cms-view-assign-floating-btn cms-mobile-floating-action-btn`}>
                    <EditNoteIcon className='cms-important-icon' />
                </div>
            

            <div onClick={handleExpand} className="cms-mobile-floating-action-btn">
                {
                    isExpand?<ExpandMore className='cms-expand-icon' />: <ExpandLess className='cms-expand-icon'/>
                }
            </div>

            </div>

          
        
        <div className="class-important-tabs-container">
            
            
            <button onClick={handleShowToday} className="class-today-tab cms-tab">
                <div className="cms-important-icon-container">
                    <SplitscreenIcon className='cms-important-icon' />
                </div>
                <p>Today</p>
               
            </button>
            
            
            <button onClick={handleShowAssignments} className="class-assignments-tab cms-tab">
                <div className="cms-important-icon-container">
                    <EditNoteIcon className='cms-important-icon' />
                </div>
                <p>Assignments</p>
            </button>

            <button onClick={handleShowExams} className="class-exams-tab cms-tab">
                <div className="cms-important-icon-container">
                    <EditNoteIcon className='cms-important-icon' />
                </div>
                <p>Exams</p>
            </button>

            <div className="cms-today-mobile-info-container">

                <div className="cms-today-hello-text cms-today-animate">
                    {isMorning && <h3>Good Morning ☀️</h3>}
                    {isAfternoon && <h3>Good Afternoon 🕒</h3>}
                    {isEvening && <h3>Good Evening 🌄</h3> }
                </div>

                <div className="cms-today-title cms-today-animate">
                   { !isWeekend && <h3>Todays' Modules</h3>}
                </div>

                {!isWeekend?todayModule?.map((today)=>{
                    return(
                        <div key={today?._id} className="cms-today-cls cms-today-animate cms-today-cls-mobile">
                            <p>{today?.code}</p>
                            <p>{today?.lecturer}</p>
                        </div>
                    )
                }):<></>}


                {isWeekend &&  <h3 className='cms-today-title cms-today-animate'>Have a great weekend ✝️ ☪️</h3>}

            </div>

           


        </div>       


        </div>

        {/* <div className="footer-container">
            <div className="footer-text-container">
            <Link to={'/'} className="logo-container">
                <h1 className='logo-title'>CMS</h1>
                <p><strong>Electrical Department D2</strong></p>
                <p>BECE, BEEE, BETE & BBME</p>

            </Link>
            <br />
                <hr className="footer-line" />
                <br />
                <p className='copyright'>© 2024 CMS Electrical Department D2</p>
                <br />
            </div>
        </div> */}



    </div>
  )
}

export default Home