import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Airlinelogo from "./logo-no-background.png";
import "./Homepage.css";

const Homepage = ({ setEmail }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/Logincustadmin");
  };

  const handleRegisterClick = () => {
    navigate("/Register");
  };

  const handleOnGuest = () => {
    navigate("/Flight");
    setEmail(null);
  };

  return (
    <div className="Homebody">
      <div className="HomeDiv">
        <div className="HomeImage">
          <img src={Airlinelogo} alt="B Airways Logo" />
        </div>
        <div className="HomeHeader">
          <h1>Welcome to B Airlines</h1>
        </div>
        <div className="LoginButton">
          <button onClick={handleLoginClick}>Login</button>
        </div>
        <div className="RegisterButton">
          <button onClick={handleRegisterClick}>Register</button>
        </div>
        <div className="GuestEntry">
          <span className="GuestState" role="button" onClick={handleOnGuest}>
            Continue as a Guest
          </span>
        </div>
        <div className="AboutUsPage">
          <Link to={"/AboutUs"}> About Us </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
