import React from 'react';
import Typical from 'react-typical';
import "./Profile.css";

export default function Profile() {
  return (
  <div clasName="profile-container">
  <div className="profile-parent">
    <div className="profile--details">
      <div className="colz">
            <a href="#"><i className="fa fa-facebook-squre"></i> </a> 
            <a href="https://twitter.com/Emmahagan23"><i className="fa fa-twitter"></i> </a> 
            <a href="#" > <i className="fa fa-google-plus-squre"></i> </a>
            <a href="https://www.linkedin.com/in/emmanuel-hagan-26219a95/" ><i className="fa fa-linkedin"></i> </a>
      </div>
      <div className="profile-detail-name">
        <span className="primary-text">
          {" "}
          Hello, I'M <span className="highlighted-text">Emmanuel Hagan</span> 
        </span>
      </div>  
      <div className="profile-detail-role">
        <span className="primary-text">
        {" "}
          <h1>
          <Typical
          loop={Infinity}
          steps={[
            "Ethusiastic  Dev",
            1000,
            "Mern Stack Dev",
            1000,
            "Cross Platform",
            1000,
            "React/PHP Dev",
            1000,
          ]
        }
          />
          </h1>
        </span>
      
        <span className="profile-role-tagline"> 
        Knack of building application with front and back end operation.
        </span>
        </div>
        <div className='profile-option'>
          <button className="btn primary-btn">
            {""}
            Hire Me{""}
          </button>
          <a href="EMMANUEL HAGAN-CV-2021-12-21.pdf"  download=""> 
          <button className='btn highlighted-btn'>Get Resume</button></a>
          </div>
    </div>
  </div>
</div>
)
}



