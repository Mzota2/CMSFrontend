import React, { useEffect, useState } from 'react'
import './Announcement.css';
import SubNav from '../../Components/SubNav/SubNav';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';

import {getAnnouncements} from '../../State/AnnouncementsSlice';
import { appUrl } from '../../Helpers';
import Loader from '../../Components/Loader/Loader';

function Announcement() {

    //active user
    const activeUser= useSelector(state=> state.students.activeUser);

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    //announcements
    const foundAnnouncements = useSelector(state => state.announcements.data);
    const announcementsStatus = useSelector(state => state.announcements.status);
    const [announcements, setAnnouncements] = useState();


    //create announcement
    const [mAnnouncement, setMannouncement] = useState({
        agenda:'',
        description:'',
        date:'',
        time:'',
        duration:0
    });

    const dd = new Date();
    const year = dd.getFullYear();
    const month = dd.getMonth();

    const dayOfYear = date => Math.floor((date - new Date(dd.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    function getNumberOfWeek() {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    console.log((dayOfYear(new Date(dd.getFullYear(), dd.getMonth(), dd.getDay()))));



    async function removeInvalidAnnouncements(){
        

        try {
            if(announcements?.length){
                announcements?.map(async(anno)=>{
                  if((anno?.duration > getNumberOfWeek())|| (anno?.duration > month) || (anno?.duration > dayOfYear()))
                    
                  await axios.delete(`${appUrl}announcement/${anno?._id}`);
    
                });
            }
            
        } catch (error) {
            console.log(error);
        }

    }


    function handleChange(e){
        setMannouncement(prev =>{
            return{
                ...prev,
                [e.target.name]:e.target.value
            }
        })
    }

    function setTime(){
        const date = new Date();
        const time = date.getTime();
        return time;
    }

    function setDate(){
        const date = new Date();
        const today = date.getDate();
        return today;
    }


    async function makeAnnouncement(){
        try {

            const response = await axios.post(`${appUrl}announcement`, {...mAnnouncement, time:setTime(), date:setDate()});
            const {data} = response;
            
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{

        if(announcementsStatus === 'idle'){
            setIsLoading(true)
            dispatch(getAnnouncements());
        }

        else if(announcementsStatus !== 'idle'){
            setAnnouncements(foundAnnouncements);
            setIsLoading(false);
            removeInvalidAnnouncements();
        }


    }, [dispatch, announcementsStatus, foundAnnouncements, activeUser]);

    // if(isLoading){
    //     return <Loader/>
    // }
  return (
    <div className='cms-announcements-section'>

      <SubNav/>

      <br /><br />

      <h3>Announcements</h3>

      <br />

      <div className="cms-announcements-container">
        {
            announcements?.length? announcements?.map((anno)=>{
                return(
                    <div key={anno?._id} className="cms-main-announcement">

                        <div className="cms-announcement-details">
                            <h4>{anno?.agenda}</h4>
                            <p>{anno?.date}</p>
                            {/* <p>{anno?.time}</p> */}
                        </div>

                        <div className="cms-announcement-description">
                            <p>{anno?.description}</p>
                        </div>
                        
                    </div>
                )
            }):<></>
        }
      </div>

      <br />
        {activeUser?.isClassRep && <div>
      
            <h3>Make Announcement</h3>

            <br />

            <form className='cms-announcement-form'>
                        
                    
                        <div className="cms-row">
                            <input value={mAnnouncement.agenda}  onChange={handleChange} name='agenda' type="text" placeholder='Enter agenda' className='cms-input-field cms-assign-field' />

                        
                            <select onChange={handleChange} value={mAnnouncement.duration} name="duration" id="duration" className='cms-input-field cms-assign-field'>
                                <option value="">Duration</option>
                                <option value={dayOfYear(new Date(dd?.getFullYear(), dd?.getMonth(), dd?.getDay()))}>A Day</option>
                                <option value={getNumberOfWeek()}>A Week</option>
                                <option value={month}>A Month</option>
                            </select>
                        </div>


                        <textarea placeholder='Enter description'  value={mAnnouncement.description}  onChange={handleChange}  name="description" id="description" cols="30" rows="10" className='cms-input-field cms-assign-field cms-announce-text-area'></textarea>
            
                        
                        <button type='button' onClick={makeAnnouncement} className='cms-btn cms-btn-save cms-create-assign-btn'>Send</button>
                        <hr className='hr' />
                        
                        
                    
            </form>
        </div>
        }
    
    
     

    </div>
  )
}

export default Announcement