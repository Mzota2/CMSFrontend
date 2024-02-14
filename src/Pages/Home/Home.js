import React from 'react'
import image1 from '../../Assets/image1.jpg';
import image2 from '../../Assets/image2.jpg';
import image3 from '../../Assets/image3.jpg';

import { Link } from 'react-router-dom';

import './Home.css';
import { useDispatch } from 'react-redux';
import { setActive } from '../../State/StudentsSlice';


function Home() {
    const [index, setIndex] = React.useState(1);
    const dispatch = useDispatch();

    const imagePaths = [image1, image2, image3];

    const classActivies = [{image:'', title:''}, {image:'', title:''}, {image:'', title:""}];
    const classNotice = ['Department T-shirts', 'Department Class Party', 'Department Trip']

    function handleNext(){
        setIndex(2)
    }

    function handlePrev(){
        setIndex(0)
    }

    function handleCurrent(){
        setIndex(prev => 1);
    }

    React.useEffect(()=>{
        const user =JSON.parse(localStorage.getItem('cms-user'));
       
        if(user){
            dispatch(setActive(user));
        }
    }, [index])
  return (
    <div className=''>

        <div className="home-image-container">

          <img className='home-image' src={imagePaths[index]} alt="class" />
        
          <div className="home-image-controllers">
            <div onClick={handlePrev} className="ellipse-button"></div>
            <div onClick={handleCurrent} className="ellipse-button ellipse-current"></div>
            <div onClick={handleNext} className="ellipse-button"></div>
          </div>

        <div className="home-background-overlay">
            
        </div>

        </div>



        <div className="class-notice-board">
            {classNotice.map((notice, index)=>{
                return(
                    <div key={index} className="class-notice-container">
                        <h1 className="class-notice-title">{notice}</h1>
                    </div>
                )
            })}

        </div>

        {/* <div className="home-class-activies">

            {
                classActivies.map((activity)=>{
                    const {image, title} = activity;
                    return(
                        <div className="class-activity-container">
                            <img className='class-activity-image' src={image} alt="class" />
                            <h2 className='class-activity-title'>{title}</h2>
                        </div>
                    )
                })
            }

        </div> */}

        <div className="footer-container">
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
        </div>

    </div>
  )
}

export default Home