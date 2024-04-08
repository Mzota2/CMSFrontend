import React from 'react';
import './Modules.css';
import { useSelector, useDispatch } from 'react-redux';
import { getModules } from '../../State/ModulesSlice';
import { getPrograms } from '../../State/ProgramsSlice';
import {getStudents, setActive} from '../../State/StudentsSlice'
import { Link } from 'react-router-dom';
import SubNav from '../../Components/SubNav/SubNav';
import { appUrl } from '../../Helpers';
import axios from 'axios';
import { moduleSchema } from '../../Components/Yup/Schema';
import {Formik} from 'formik'
import {CircularProgress} from '@mui/material'
import {Add, Close, Remove, Edit, Delete, RemoveCircleOutline, AddCircleOutline} from '@mui/icons-material';

import moduleBackgroundImage from '../../Assets/modules.jpg';
import Loader from '../../Components/Loader/Loader';

function Modules() {



  //active tab

  const [activeTab, setActiveTab] = React.useState('My Modules');

  //DOM
  const [viewEditModule, setViewEditModule] = React.useState(false);
  const [viewAddModule, setViewModule] = React.useState(false);
  const [user, setUser] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const [classDays, setClassDays] = React.useState([{
    from:'',
    to:'',
    room:'',
    day:'',
    isCancelled:false
  },{
    from:'',
    to:'',
    room:'',
    day:'',
    isCancelled:false
  },{
    from:'',
    to:'',
    time:'',
    room:'',
    day:'',
    isCancelled:false
  }]);
  const [daysNum, setDaysNum] = React.useState(1);
  const [isViewDepartment, setIsViewDepartment] = React.useState(false);

  const activeUser = useSelector(state => state.students.activeUser);//gets active user

  const dispatch = useDispatch();

  //all students

  const foundStudents = useSelector(state => state.students.data);
  const studentsStatus = useSelector(state => state.students.status);
  const studentModules = useSelector(state => state.students.modules);
  const activeStudent = useSelector(state => state.students.activeUser);
  const [students, setStudents] = React.useState();

  //programs status
  const foundPrograms = useSelector(state => state.programs.data);
  const programsStatus = useSelector(state => state.programs.status);
  const [program, setProgram] = React.useState();

  //modules status
  const foundModules = useSelector(state => state.modules.data);
  const modulesStatus = useSelector(state => state.modules.status);
  const [modules, setModules] = React.useState();

  //edit module
  const [moduleData, setModuleData] = React.useState();


  //DOM Functions

  function handleActiveTab(e){
    setActiveTab(e.target.innerText);
  }

  function handleDisplayEditModule(id){
    const currentModule = modules?.find((md => md?._id === id));
    setModuleData(currentModule);

    handleViewEditModule();

  }

  function handleViewEditModule(){
    setViewEditModule(prev => !prev);
  }
  function handleViewAddModule(){
    setViewModule(prev => !prev);
  }

  function handleMyModules(e){
    console.log(activeUser)
    //activateTab
    handleActiveTab(e);
    setIsViewDepartment(false);
    //get all my modules
    const myModules = user?.modules?.map((myModule)=>{
      const existingModule = foundModules?.find(md => md._id === myModule);
      if(existingModule){
        console.log(existingModule);
        console.log('found');
        return existingModule;

      }
     
    
    })?.filter((md)=> md); //check if its defined

    console.log(myModules);

    setModules(myModules);
 
  }

  function handleAllModules(e){
    handleActiveTab(e)
    setIsViewDepartment(false);
    const allModules = foundModules?.filter((md)=>{
      return md?.programsId.find((pg)=> pg === user?.program); //find the modules in that program
    });

    console.log(allModules);
    setModules(allModules);

  }

  function handleDepartmentModules(e){
    handleActiveTab(e); //activate tab
    setIsViewDepartment(true);
    setModules(foundModules);
  }

  function handleUpdateModule(values){
    console.log(values);

    const currentModule = {...values, classDays};
    editModule(currentModule, currentModule?._id);
  }

  //editing a module
  async function editModule(module, id){
    try {

      const response = await axios.put(`${appUrl}module/${id}`, module);
      const {data} = response;
      console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  }

  //updateStudents
  async function updateStudent(id, student){
    try {

      const response = await axios.put(`${appUrl}student/${id}`, student);

      const {data} = response;
      console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  }

  //deleting a module
  async function deleteModule(id){
    try {

      const response = await axios.delete(`${appUrl}module/${id}`);
      const {data} = response;
      console.log(data);

      //remove in my modules

      students?.map((student)=>{
        const foundModule = student?.modules?.find((md)=> md === id);
        if(foundModule){
          //delete the module

          const remainingModules = student?.modules?.filter((md=> md !== id));
          const currentStudent = {...student, modules:remainingModules};
          updateStudent(student?._id, currentStudent);

        }
      })

      
    } catch (error) {
      console.log(error);
    }
  }

  
  async function createModule(module){
    try {
        //classDays

      setIsLoading(true);
      //class days
      const moduleDays = classDays.slice(0, daysNum);


      const response = await axios.post(`${appUrl}module`, {...module, classDays:moduleDays});
      const {data} = response;
     

      handleAdd(data?._id); //added created module to my modules

    } catch (error) {
      console.log(error);
    }
    finally{
      setIsLoading(false);
    }

  }

  async function handleEnroll(id){
    console.log(id);
    
    try {
      const studentModules =user?.modules?user?.modules.concat(id):[id];

      console.log(studentModules);
      const response = await axios.put(`${appUrl}student/${user?._id}`, {...user, modules:studentModules});
      const {data} = response;
      //console.log(data);
      localStorage.setItem('cms-user', JSON.stringify(data));
      dispatch(setActive(data));
      
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLeave(id){
    try {
      const studentModules = user?.modules?.filter((md)=> md !== id);
      const response = await axios.put(`${appUrl}student/${user?._id}`, {...user, modules:studentModules});
      const {data} = response;
      console.log(data);
      localStorage.setItem('cms-user', JSON.stringify(data));
      dispatch(setActive(data));
      
    } catch (error) {
      console.log(error);
    }

  }

  async function handleAdd(id){
    try {
      console.log(id);

      const selectedModule = modules?.find((md)=> md?._id === id);
      console.log(selectedModule?.programsId)
      const modulePrograms = selectedModule?.programsId? selectedModule.programsId?.concat(user?.program):[user?.program];

      console.log(modulePrograms);
      const response = await axios.put(`${appUrl}module/${id}`, {...selectedModule, programsId:modulePrograms});
      const {data} = response;
      dispatch(getModules()); //get updated modules list
      console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRemove(id){
    try {

      console.log(id);
      const selectedModule = modules?.find((md)=> md?._id === id);
      const modulePrograms = selectedModule?.programsId?.filter((pg)=> pg !== user?.program);
      console.log(modulePrograms);
      const response = await axios.put(`${appUrl}module/${id}`, {...selectedModule, programsId:modulePrograms});
      const {data} = response;

      //remaining modules

      dispatch(getModules()); //get updated modules list
    
      
    } catch (error) {
      console.log(error);
    }
    

  }
  function handleSubmit(values,action){
    console.log(values);
    createModule(values);
  }


  function handleChangeTime(e, index, pos){

    const updateTime = classDays?.find((md, ind)=> ind === index);
    updateTime[pos] = e.target.value;
    const updatedClass = [...classDays];
    setClassDays(prev=>{
      return[
        ...updatedClass
  
      ]
    });
    
    console.log(classDays);
  }


  function handleChangeDay(e, index){
    const updateTime = classDays?.find((md, ind)=> ind === index);
    updateTime.day = e.target.value;
    const updatedClass = [...classDays];
    setClassDays(prev=>{
      return[
        ...updatedClass
  
      ]
    });
    
    console.log(classDays);
  }

  function handleChangeRoom(e, index){
    const updateTime = classDays?.find((md, ind)=> ind === index);
    updateTime.room = e.target.value;
    const updatedClass = [...classDays];
    setClassDays(prev=>{
      return[
        ...updatedClass
  
      ]
    });
    
    console.log(classDays);
  }


  function handleIncrementDays(){

    if(daysNum < 3){
      setDaysNum(prev => prev+1);
    }
    else{
      setDaysNum(3);
    }
   
  }

  function handleDecrementDays(){
    if(daysNum >1){
      setDaysNum(prev => prev-1);
    }
    else{
      setDaysNum(1);
    }
  }

  React.useEffect(()=>{

    if(modulesStatus === 'idle'){
      dispatch(getModules());
    }

    else if(modulesStatus !== 'idle'){
      if(activeTab === 'My Modules' && activeStudent){
           //get all my modules

         setModules(studentModules);
      }

      else if(activeTab === 'Department'){
       
         setModules(foundModules);
      }

      else if(activeTab === 'All Modules'){
        const allModules = foundModules?.filter((md)=>{
          return md?.programsId.find((pg)=> pg === user?.program); //find the modules in that program
        });
    
        console.log(allModules);
        setModules(allModules);
      }
    
    
      
    }

    if(programsStatus === 'idle'){
      dispatch(getPrograms());
    }
    else if(programsStatus !== 'idle' ){
      console.log('it is active');
      const userProgram = foundPrograms?.find((program)=> program._id === user?.program);
      setProgram(userProgram);
      console.log(user);
    }

    if(studentsStatus  === 'idle'){
      dispatch(getStudents());
    }

    else if(studentsStatus !== 'idle'){
      setStudents(foundStudents);
    }
    
    setUser(activeUser);
   
   

    // console.log(user?._id);
    // handleMyModules();

  }, [dispatch, modulesStatus, activeUser, programsStatus, foundModules, studentsStatus, foundStudents]);
    

  if(modulesStatus === 'idle'){
    return <Loader/>
  }
  return (
    <div className='container'>{
            viewAddModule?
            <div className="add-window-container">
                
                <div onClick={handleViewAddModule} className="close-icon-container">
                    <Close className='close-icon' />
                </div>

                <Formik
                    initialValues={{
                        programsId:[user?.program],
                        name:'',
                        code:'',
                        lecturer:'',
    
                    }}

                    validationSchema={moduleSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, handleSubmit, values, errors, touched})=>(
                    <form noValidate onSubmit={handleSubmit} autoComplete='off' className="add-box">
                        <input name='name' id='name' value={values.name} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module name' />
                        {touched.name && errors.name && <p className='error-text'>{errors.name}</p>}

                        <input name='code' id='code' value={values.code} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module code' />
                        {touched.code && errors.code && <p className='error-text'>{errors.code}</p>}

                        <input name='lecturer' id='lecturer' value={values.lecturer} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module lecturer' />
                        {touched.lecturer && errors.lecturer && <p className='error-text'>{errors.lecturer}</p>}


                        <hr className='hr'/>
                        <div className='cms-module-days-container'>
                          <h5>Class details</h5>
                          
                          <div className="cms-module-dayrs-row">

                            <div className="cms-module-dayrs-time-row">
                             
                              <input value={classDays[0].from} onChange={(e)=>{handleChangeTime(e, 0, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                              <h1 htmlFor="time">:</h1>
                              <input value={classDays[0].to} onChange={(e)=>{handleChangeTime(e, 0, 'to')}} type="time" className='cms-field cms-add-student-field'/>
   
                            </div>
                           
                            <div className="cms-module-dayrs-time-row">

                              <select value={classDays[0].day} onChange={(e)=>{handleChangeDay(e, 0)}} className='cms-field cms-add-student-field' name="days" id="days">
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                              </select>

                              <input value={classDays[0].room} placeholder='Enter room' onChange={(e)=>{handleChangeRoom(e, 0)}} type="text" className='cms-field cms-add-student-field' />


                            </div>
                           
                          </div>

                         {daysNum >=2 && <div className="cms-module-dayrs-row">

                          <div className="cms-module-dayrs-time-row">
                            <input value={classDays[1].from} onChange={(e)=>{handleChangeTime(e, 1, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                            <h1 htmlFor="time">:</h1>
                            <input value={classDays[1].to} onChange={(e)=>{handleChangeTime(e, 1, 'to')}} type="time" className='cms-field cms-add-student-field'/>

                          </div>

                          <div className="cms-module-dayrs-time-row">

                            <select value={classDays[1].day} onChange={(e)=>{handleChangeDay(e, 1)}} className='cms-field cms-add-student-field' name="days" id="days">
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                            </select>

                            <input value={classDays[1].room} placeholder='Enter room' onChange={(e)=>{handleChangeRoom(e, 1)}} type="text" className='cms-field cms-add-student-field' />


                          </div>

                          </div>}

                          
                         {daysNum >= 3 && <div className="cms-module-dayrs-row">

                              <div className="cms-module-dayrs-time-row">
                                <input value={classDays[2].from} onChange={(e)=>{handleChangeTime(e, 2, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                                <h1 htmlFor="time">:</h1>
                                <input value={classDays[2].to} onChange={(e)=>{handleChangeTime(e, 2, 'to')}} type="time" className='cms-field cms-add-student-field'/>

                              </div>

                              <div className="cms-module-dayrs-time-row">

                                <select value={classDays[2].day} onChange={(e)=>{handleChangeDay(e, 2)}} className='cms-field cms-add-student-field' name="days" id="days">
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                </select>

                                <input value={classDays[2].room} onChange={(e)=>{handleChangeRoom(e, 2)}} placeholder='Enter room' type="text" className='cms-field cms-add-student-field' />


                              </div>

                              </div>
                                  }

                          <div className="cms-add-module-control-btns">

                            <div className="cms-add-days-container cms-select-btn cms-enroll-btn">

                            <Add onClick={handleIncrementDays} className='cms-add-days' />
                            </div>

                            <div className="cms-add-days-container cms-select-btn cms-leave-btn cms-remove-btn">
                            <Remove onClick={handleDecrementDays} className='cms-add-days' />
                            </div>

                          </div>

                        
                        </div>

                        <button  type='submit' className='cms-btn add-student-btn'> {isLoading? <CircularProgress className='cms-loader'/>: 'Add'}</button>
                    </form>

                    )}

                </Formik>
                
            </div>:
            <></>
        }

        {
            viewEditModule?
            <div className="add-window-container">
                
                <div onClick={handleViewEditModule} className="close-icon-container">
                    <Close className='close-icon' />
                </div>

                <Formik
                    initialValues={
                     {
                      ...moduleData,
                     
                     }
                    }

                    validationSchema={moduleSchema}
                    onSubmit={handleUpdateModule}
                >
                    {({ handleChange, handleSubmit, values, errors, touched})=>(
                    <form noValidate onSubmit={handleSubmit} autoComplete='off' className="add-box">
                        <input name='name' id='name' value={values.name} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module name' />
                        {touched.name && errors.name && <p className='error-text'>{errors.name}</p>}

                        <input name='code' id='code' value={values.code} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module code' />
                        {touched.code && errors.code && <p className='error-text'>{errors.code}</p>}

                        <input name='lecturer' id='lecturer' value={values.lecturer} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module lecturer' />
                        {touched.lecturer && errors.lecturer && <p className='error-text'>{errors.lecturer}</p>}

                        <div className='cms-module-days-container'>
                          <label htmlFor="days">Class Time</label>
                          <br />
                          <div className="cms-module-dayrs-row">

                            <div className="cms-module-dayrs-time-row">
                              <label htmlFor="time">From</label>
                              <input value={classDays[0].from} onChange={(e)=>{handleChangeTime(e, 0, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                              <label htmlFor="time">To</label>
                              <input value={classDays[0].to} onChange={(e)=>{handleChangeTime(e, 0, 'to')}} type="time" className='cms-field cms-add-student-field'/>
   
                            </div>
                           
                            <div className="cms-module-dayrs-time-row">

                              <select value={classDays[0].day} onChange={(e)=>{handleChangeDay(e, 0)}} className='cms-field cms-add-student-field' name="days" id="days">
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                              </select>

                              <input value={classDays[0].room} onChange={(e)=>{handleChangeRoom(e, 0)}} type="text" className='cms-field cms-add-student-field' />


                            </div>
                           
                          </div>

                         {daysNum >=2 && <div className="cms-module-dayrs-row">

                          <div className="cms-module-dayrs-time-row">
                            <label htmlFor="time">From</label>
                            <input value={classDays[1].from} onChange={(e)=>{handleChangeTime(e, 1, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                            <label htmlFor="time">To</label>
                            <input value={classDays[1].to} onChange={(e)=>{handleChangeTime(e, 1, 'to')}} type="time" className='cms-field cms-add-student-field'/>

                          </div>

                          <div className="cms-module-dayrs-time-row">

                            <select value={classDays[1].day} onChange={(e)=>{handleChangeDay(e, 1)}} className='cms-field cms-add-student-field' name="days" id="days">
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                            </select>

                            <input value={classDays[1].room} onChange={(e)=>{handleChangeRoom(e, 1)}} type="text" className='cms-field cms-add-student-field' />


                          </div>

                          </div>}

                          
                         {daysNum >= 3 && <div className="cms-module-dayrs-row">

                              <div className="cms-module-dayrs-time-row">
                                <label htmlFor="time">From</label>
                                <input value={classDays[2].from} onChange={(e)=>{handleChangeTime(e, 2, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                                <label htmlFor="time">To</label>
                                <input value={classDays[2].to} onChange={(e)=>{handleChangeTime(e, 2, 'to')}} type="time" className='cms-field cms-add-student-field'/>

                              </div>

                              <div className="cms-module-dayrs-time-row">

                                <select value={classDays[2].day} onChange={(e)=>{handleChangeDay(e, 2)}} className='cms-field cms-add-student-field' name="days" id="days">
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                </select>

                                <input value={classDays[2].room} onChange={(e)=>{handleChangeRoom(e, 2)}} type="text" className='cms-field cms-add-student-field' />


                              </div>

                              </div>
                                  }



                          <div className="cms-add-days-container">
                            <Add onClick={handleIncrementDays} className='cms-add-days' />
                          </div>

                          <div className="cms-add-days-container">
                            <Remove onClick={handleDecrementDays} className='cms-add-days' />
                          </div>

                        </div>

                        <button  type='submit' className='cms-btn add-student-btn'> {isLoading? <CircularProgress className='cms-loader'/>: 'Add'}</button>
                    </form>

                    )}

                </Formik>
                
            </div>:
            <></>
        }
        
        <div className="cms-students-background">

          <div className="cms-students-text">
              <h1 className='cms-students-title'>MODULES</h1>
              <p className='cms-students-description'>Find your modules</p>
          </div>

          <div className="video-background-overlay"></div>
          <img src={moduleBackgroundImage} alt="" className='cms-module-backgroundImage' />
        </div>
     
      <div className="class-modules-container">

          <div className="class-module-tabs-container">
                <button onClick={handleMyModules} className={`${activeTab === 'My Modules' ? 'activate-tab':'class-module-tab'} class-module-tab`}>My Modules</button>
                <button onClick={handleAllModules} className={`${activeTab === 'Program' ? 'activate-tab':'class-module-tab'} class-module-tab`}>Program</button>
    
                <button onClick={handleDepartmentModules} className={`${activeTab === 'Department' ? 'activate-tab':'class-module-tab'} class-module-tab`}>Department</button>
                
                <div onClick={handleViewAddModule} className="add-student cms-add-module-btn">
                        <Add className='add-icon' />
                </div>
          
          </div>

          <div className="class-modules-window">

            {
              isViewDepartment?
              modules?.map((module)=>{
                const isFound = module?.programsId?.find(id => id === user?.program);
                console.log(isFound);
    
                // const {name, code, lecturer} = module;
                return(
                  <div  className='class-module' key={module?._id}>
                      <h3>{module?.name}</h3> <span className='vertical-space'>|</span>
                      <p>{module?.code}</p><span className='vertical-space'>|</span>
                      <p className='class-module-lecturer'><strong>{module?.lecturer}</strong></p>
    
                      <div className="cms-class-module-controllers">
                        {
                          isFound? <button onClick={()=>{handleRemove(module?._id)}} className='cms-select-btn cms-leave-btn cms-remove-btn'> <RemoveCircleOutline className='cms-remove-icon' /></button>:
                          <button onClick={()=>{handleAdd(module?._id)}} className='cms-select-btn cms-enroll-btn'> <AddCircleOutline/></button>
                        }

                        <button onClick={()=>{handleDisplayEditModule(module?._id)}} className='cms-select-btn cms-enroll-btn cms-edit-btn'> <Edit /></button>
                        <button onClick={()=>{deleteModule(module._id)}} className='cms-select-btn cms-leave-btn cms-delete-btn'> <Delete/></button>
                      </div>
    
    
                  </div>
                )
              }):modules?.map((module)=>{
                const isFound = user?.modules.find((md)=> md === module?._id);
    
                // const {name, code, lecturer} = module;
                return(
                  <div className='class-module' key={module?._id}>
                      <h3>{module?.name}</h3> <span className='vertical-space'>|</span>
                      <p>{module?.code}</p><span className='vertical-space'>|</span>
                      <p className='class-module-lecturer'><strong>{module?.lecturer}</strong></p>
    
                      <div className="cms-class-module-controllers">
                        {
                          isFound? <button  onClick={()=>{handleLeave(module?._id)}} className='cms-select-btn cms-leave-btn'><RemoveCircleOutline/></button>:
                          <button onClick={()=>{handleEnroll(module?._id)}} className='cms-select-btn cms-enroll-btn'><AddCircleOutline/></button>
                        }
                        
                      </div>
    
    
                  </div>
                )
              })
            }

        </div>

      </div>
    

        

    </div>
  )
}

export default Modules