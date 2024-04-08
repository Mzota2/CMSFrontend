import React from 'react';
import { Link } from 'react-router-dom';
import './SubNav.css';

function SubNav() {
  return (
    <div className='cms-sub-nav'>

        <div className="sub-c-nav-container">
          <Link to={'/'} className="sub-logo-container">
                <h1 className='logo-title'>CMS</h1>
                <p>Electrical Department D2</p>
          </Link>
        </div>
            <br />
        <hr className='sub-nav-line' />


    </div>
  )
}

export default SubNav