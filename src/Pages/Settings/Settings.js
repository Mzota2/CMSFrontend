import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { appUrl } from '../../Helpers';
import {message } from 'antd';
// import {compare} from 'bcrypt'

import './Settings.css';
import SubNav from '../../Components/SubNav/SubNav';

function Settings() {

  //user
  const foundUser = useSelector(state => state.students.activeUser);
  const [isPreviousPWD, setIsPreviousPWD] = useState();
  const [passwordMatch, setPasswordMatch] =useState();

  const [user, setUser] = useState({});

  //password
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  function handleChangePassword(e){
    setPassword(e.target.value);
  }

  function handleConfirmPassword(e){
    setConfirmPassword(e.target.value)
  }

  function handleNewPassword(e){
    setNewPassword(e.target.value);
  }

  function handleChange(e){
    setUser(prev => {
      return {
        ...prev,
        [e.target.name]:e.target.value
      }
    })
  }

  async function updateUser (){
    try {
      const response = await axios.put(`${appUrl}student/${user?._id}`, {...user, username:user?.username, regNO:user?.regNO});
      const {data} = response;
      setUser(data);
      window.alert("Updated user successfully");
    } catch (error) {
      console.log(error);
    }
  }

  async function updatePassword(){
    try {
      if(newPassword?.length >= 7){
        if(isPreviousPWD && passwordMatch){
          const response = await axios.put(`${appUrl}student/${user?._id}`, {password:newPassword});
          const {data} = response;
          setUser(data);
          message.success("changed password successfully");
        }
      }else{
        message.error('Enter at least 7 characters');
      }
      

      
    } catch (error) {
      console.log(error);
    }
  }


async function verifyPWD(user){

  // const isMatch = await compare(password, user?.password);
  try {
    const response = await axios.post(`${appUrl}student/signin`, {email:user?.email, password:password});
    const {data} = response;

    setIsPreviousPWD(true);
    
  } catch (error) {
  
    setIsPreviousPWD(false);
    console.log(error);
  }

}
  
  useEffect(()=>{

    setPasswordMatch(prev =>{
      const passwordMatch = newPassword === confirmPassword?true:false;
      return passwordMatch
      
    });
   
    if(foundUser){
      setUser(foundUser);
      verifyPWD(foundUser)
      
    }

  }, [foundUser, password, confirmPassword])
  return (
    <div className='cms-settings-container'>

      <SubNav/>

      <br /><br />
        
        
        <form className='cms-form cms-assign-form'>
                    
                    <input value={user?.username}  onChange={handleChange} name='username' type="text" placeholder='Enter name' className='cms-input-field cms-assign-field' />
                    
      
                    <input value={user?.regNO}  onChange={handleChange} name="regNO" type="text" placeholder='Enter reg NO' className='cms-input-field cms-assign-field' />
                      
                    <button type='button' onClick={updateUser} className='cms-btn cms-btn-save cms-create-assign-btn'>Save</button>
                    <hr className='hr' />

                    <h4>Security</h4>

                    <input value={password} onChange={handleChangePassword}  name="password" placeholder='Enter previous password' type="password" className={`${isPreviousPWD ?'cms-password-match':'cms-password-diff'} cms-input-field cms-assign-field`} />
                    
                    <input value={newPassword} onChange={handleNewPassword} disabled={isPreviousPWD?false:true}  name="password" placeholder='Enter new password' type="password" className={`${isPreviousPWD?'cms-password-match':''} cms-input-field cms-assign-field`}/>
                      
                    <input value={confirmPassword} onChange={handleConfirmPassword}   name="text" placeholder='Confirm password' type="password" className={`${passwordMatch && newPassword?'cms-password-match': newPassword?'cms-password-diff':''} cms-input-field cms-assign-field`} />
                  

                    <button type='button' disabled={!(isPreviousPWD && passwordMatch)} onClick={updatePassword} className='cms-btn cms-btn-save cms-create-assign-btn'>Confirm</button>
                    
                
                </form>:

    </div>
  )
}

export default Settings