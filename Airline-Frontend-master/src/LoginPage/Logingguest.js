import email_icon from "../Assets/email.png";
import person_icon from "../Assets/person.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logingguest = () => {
  const navigate = useNavigate();

  function guestAccountHandler() {
    navigate("/Register");
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login as a Guest</div>
        <div className="underline"></div>
      </div>

      <form>
        <div className="inputs">
          <div className="input">
            <img src={person_icon} alt={"person"} />
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input">
            <img src={email_icon} alt={"email"} />
            <input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="submit-container">
          <button>Login</button>
        </div>
      </form>
      <div className="guestCreate">
        <div className="guestState">Or</div>
        <button onClick={guestAccountHandler}>Create an Account</button>
      </div>
    </div>
  );
};

export default Logingguest;
