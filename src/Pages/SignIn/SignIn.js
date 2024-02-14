import React from 'react'
import './SignIn.css';
import image1 from '../../Assets/sign.jpg';
import axios from 'axios';
import {appUrl} from '../../Helpers';
import {Formik} from 'formik'
import { Schema } from '../../Components/Yup/Schema';
import {useDispatch} from 'react-redux';
import {setActive} from '../../State/StudentsSlice'
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function SignIn() {

  const [isLoading, setIsLoading] = React.useState(false);

  const [userData, setUserData]  = React.useState();
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleShowPassword(){
    setShowPassword(prev => !prev);
  }

  const handleLogin = async(user)=>{
    try {
      setIsLoading(true)
      const response = await axios.post(`${appUrl}student/signin`, user)
      const {data}= response;
      console.log(data);
      localStorage.setItem('cms-user', JSON.stringify(data));
      dispatch(setActive(data));
      navigate('/');
     
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

  function handleSubmit(values){
    
    console.log(values);
    handleLogin(values);
  }


  return (
    <div className='signin-container'>

      <Formik
      
      initialValues={{
        email:'',
        password:'',
      }}

      validationSchema={Schema}
      onSubmit={handleSubmit}
      >{({handleSubmit, handleChange, errors, values, touched})=>(

        <form noValidate onSubmit={handleSubmit} className="signin-form" autoComplete='off'>

          <div className="sign-field">
              <label htmlFor="email">Email</label>
              <input onChange={handleChange} value={values.email} name='email' className='cms-input-field' type="text" id='email' placeholder='Enter email' />
              {touched.email && errors.email && <p className='error-text'>{errors.email}</p>}
          </div>

          <div className="sign-field">
              <label htmlFor="password">Password</label>
              <input onChange={handleChange} value={values.password} name='password' className='cms-input-field' type={`${showPassword?'text':'password'}`} placeholder='Enter password...' id='password'/>
              {touched.password && errors.password && <p className='error-text'>{errors.password}</p>}
              
              <div className="show-pwd-container">
                <input className='checkPassword' id='checkPassword' type="checkbox" checked={showPassword} onChange={handleShowPassword} />
                <label htmlFor="checkPassword">Show Password</label>
              </div>

          </div>

          <button type='submit' className='cms-btn cms-submit-btn'>
            {isLoading?<Box sx={{ display: 'flex' }}>
                <CircularProgress className='cms-loader' />
              </Box>:'Login'}  
          </button>


        </form>

      )}

      </Formik>
       

        <div className='sign-image-container'>
            <img className='sign-image' src={image1} alt="class" />

            <div className="image-overlay"></div>
        </div>


    </div>
  )
}

export default SignIn