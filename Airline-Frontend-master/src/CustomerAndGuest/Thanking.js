import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import thank_you from "./thank you.png";
import "./Thanking.css";

const Thanking = () => {
  const navigate = useNavigate();

  function HandleLogOut() {
    navigate("/");
  }

  useEffect(() => {
    // Add the "show" class after a short delay to trigger the animation
    const container = document.querySelector(".containerThanking");
    if (container) {
      setTimeout(() => {
        container.classList.add("show");
      }, 1000);
    }
  }, []);

  return (
    <div className="containerThanking">
      <h1 className="title">Thank you for Booking with us</h1>
      <h2 className="subtitle">Have a safe journey</h2>
      <img className="image" src={thank_you} alt="Thank you" />
      <button className="button" onClick={HandleLogOut}>
        Log Out
      </button>
    </div>
  );
};

export default Thanking;
