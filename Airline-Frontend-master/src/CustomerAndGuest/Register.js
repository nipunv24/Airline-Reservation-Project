import "./Register.css";

import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { backend } from "../utilities";

const Register = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [NIC, setNIC] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passport, setPassport] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [birthdayError, setBirthdayError] = useState("");
  const [NICError, setNICError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passportError, setPassportError] = useState("");
  const [status, setStatus] = useState("");
  const [isDisable, setIsDisable] = useState(true);

  const navigate = useNavigate();

  function validateForm() {
    // Validation for name (letters and spaces only)
    const namePattern = /^[a-zA-Z\s]+/;

    // Validation for email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/;

    // Validation for NIC (12 digits)
    const nicPattern = /^\d{12}/;

    // Validation for phone number (starts with '0' and contains 10 digits)
    const phonePattern = /^0\d{9}/;

    // Validation for passport (start with a letter, followed by 7 digits)
    const passportPattern = /^[A-Z]\d{7}/;

    let isFormValid = true;

    if (!name.match(namePattern)) {
      setNameError("Name should only contain letters and spaces.");
      isFormValid = false;
    } else {
      setNameError("");
    }

    if (address === "") {
      setAddressError("Address is required.");
      isFormValid = false;
    } else {
      setAddressError("");
    }

    if (!email.match(emailPattern)) {
      setEmailError("Invalid email format.");
      isFormValid = false;
    } else {
      setEmailError("");
    }

    if (password === "") {
      setPasswordError("Password is required.");
      isFormValid = false;
    } else {
      setPasswordError("");
    }

    if (birthday === "") {
      setBirthdayError("Birthday is required.");
      isFormValid = false;
    } else {
      setBirthdayError("");
    }

    if (!NIC.match(nicPattern)) {
      setNICError("NIC should contain 12 digits.");
      isFormValid = false;
    } else {
      setNICError("");
    }

    if (!phoneNumber.match(phonePattern)) {
      setPhoneNumberError(
        "Phone number should start with '0' and contain 10 digits."
      );
      isFormValid = false;
    } else {
      setPhoneNumberError("");
    }

    if (!passport.match(passportPattern)) {
      setPassportError(
        "Passport should start with an UPPERCASE letter and be followed by 7 digits."
      );
      isFormValid = false;
    } else {
      setPassportError("");
    }

    if (isFormValid) {
      backend("/create-user", {
        body: {
          name,
          address,
          email,
          password,
          birthday,
          NIC,
          phoneNumber,
          passport,
        },
      }).then(() => {
        setStatus("Account Created Successfully!");
        setIsDisable(false);
      });
    } else {
      setStatus("Error! Try Again.");
    }
  }

  function redirectLogin() {
    navigate("/Logincustadmin");
  }

  //New
  function clearForm() {
    // Clear all field values
    setName("");
    setAddress("");
    setEmail("");
    setPassword("");
    setBirthday("");
    setNIC("");
    setPhoneNumber("");
    setPassport("");
    // Clear all error messages
    setNameError("");
    setAddressError("");
    setEmailError("");
    setPasswordError("");
    setBirthdayError("");
    setNICError("");
    setPhoneNumberError("");
    setPassportError("");
    setStatus("");
    setIsDisable(true);
  }

  return (
    <div className="Registerbody">
      <div className="Registercontainer">
        <div className="Registerheader">
          <div className="Registertext">
            <h1 className="RegisterState">
              <strong>Create an Account</strong>
            </h1>
          </div>

          <div className="Registerunderline"></div>
        </div>

        <form>
          <div className="Registerinput">
            <label> Name : </label>
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="ErrorMessage">{nameError}</div>
          </div>

          <div className="Registerinput">
            <label>Address : </label>
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="ErrorMessage">{addressError}</div>
          </div>

          <div className="Registerinput">
            <label>E-mail : </label>
            <input
              type="email"
              placeholder="E-mail ex:-xxxxx@xx.xxx"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="ErrorMessage">{emailError}</div>
          </div>

          <div className="Registerinput">
            <label>Password : </label>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="ErrorMessage">{passwordError}</div>
          </div>

          <div className="Registerinput">
            <label>Birthday : </label>
            <input
              type="date"
              placeholder="Birthday"
              required
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <div className="ErrorMessage">{birthdayError}</div>
          </div>

          <div className="Registerinput">
            <label>NIC : </label>
            <input
              type="text"
              placeholder="NIC (12 digits)"
              required
              value={NIC}
              onChange={(e) => setNIC(e.target.value)}
            />
            <div className="ErrorMessage">{NICError}</div>
          </div>

          <div className="Registerinput">
            <label>Phone Number : </label>
            <input
              type="text"
              placeholder="Phone Number ex:-0XXXXXXXXX"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div className="ErrorMessage">{phoneNumberError}</div>
          </div>

          <div className="Registerinput">
            <label>Passport Number : </label>
            <input
              type="text"
              placeholder="Passport (1 UPPERCASE letter followed by 7 digits)"
              required
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
            />
            <div className="ErrorMessage">{passportError}</div>
          </div>

          <div className="Registersubmit-container">
            <button
              onClick={(e) => {
                e.preventDefault();
                validateForm();
              }}
            >
              Create Account
            </button>
          </div>
          <button className="ClearButton" type="button" onClick={clearForm}>
            Clear
          </button>
        </form>
        <button
          className="RegisterNewLogin"
          disabled={isDisable}
          onClick={redirectLogin}
        >
          Login
        </button>
        <div className="RegisterStatus">
          <strong>{status}</strong>
        </div>
      </div>
    </div>
  );
};

export default Register;
