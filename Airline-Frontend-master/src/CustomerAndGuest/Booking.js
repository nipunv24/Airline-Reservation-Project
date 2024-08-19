import "./Booking.css";

import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { backend } from "../utilities";

const Booking = ({
  count,
  setCount,
  passengers,
  setPassengers,
  flightID,
  email,
  setEmail,
}) => {
  const [checkDisabled, setCheckDisabled] = useState(true);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [flightModel, setFlightModel] = useState("");
  const [errors, setErrors] = useState([]); // Error messages state
  const [selectedTravelerClass, setSelectedTravelerClass] = useState("Economy");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [newTravel, setNewTravel] = useState("");
  const [bookedSeatNumbers, setBookedSeatNumbers] = useState([
    3, 8, 12, 14, 20, 31,
  ]);
  // let FlightsDetails = [
  //   {
  //     flight_id: "F0001",
  //     model: "Airbus A380",
  //     Economy_seat_count: 420,
  //     Business_seat_count: 95,
  //     Platinum_seat_count: 10,
  //     bookedSeats: {
  //       Economy: [5, 10, 15, 20], // Example Economy class booked seats
  //       Business: [2, 7, 12], // Example Business class booked seats
  //       Platinum: [1, 3], // Example Platinum class booked seats
  //     },
  //   },
  //   {
  //     flight_id: "F0002",
  //     model: "Boeing 757-200",
  //     Economy_seat_count: 170,
  //     Business_seat_count: 22,
  //     Platinum_seat_count: 8,
  //     bookedSeats: {
  //       Economy: [150, 110],
  //       Business: [3, 10, 15, 16],
  //       Platinum: [1, 2, 8],
  //     },
  //   },
  //   {
  //     flight_id: "F0003",
  //     model: "Boeing 737-150",
  //     Economy_seat_count: 130,
  //     Business_seat_count: 27,
  //     Platinum_seat_count: 5,
  //     bookedSeats: {
  //       Economy: [15, 110],
  //       Business: [3, 16],
  //       Platinum: [1, 2],
  //     },
  //   },
  // ];

  useEffect(() => {
    backend("/flights-details", {
      body: {
        flightId: flightID,
      },
    }).then((d) => {
      if (typeof d == "string") {
        console.error(d);
        return;
      }
      setSelectedFlight(d);
      setFlightModel(d.model);
    });
  }, [flightID]);

  // Update available seats when the traveler class is changed
  useEffect(() => {
    if (flightModel) {
      const maxSeats =
        selectedTravelerClass === "Economy"
          ? selectedFlight.Economy_seat_count
          : selectedTravelerClass === "Business"
          ? selectedFlight.Business_seat_count
          : selectedFlight.Platinum_seat_count;

      let seats = Array.from({ length: maxSeats }, (_, index) => index + 1);
      // Filter out the booked seats
      seats = seats.filter((seat) => !bookedSeatNumbers.includes(seat));
      setAvailableSeats(seats);
    }
    console.log(selectedTravelerClass);
    setNewTravel(selectedTravelerClass);
  }, [selectedTravelerClass, flightModel, bookedSeatNumbers]);

  function HandleDecrease() {
    if (count > 0) {
      setCount(count - 1);
      // Remove the last passenger when decreasing count
      setPassengers(passengers.slice(0, -1));
      // Remove the corresponding error
      setErrors(errors.slice(0, -1));
    }
    // Update checkDisabled here
    setCheckDisabled(count - 1 === 0);
  }

  function handlePassengerDetailsChange(event, index) {
    const { name, value } = event.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index][name] = value;

    // Update the selected traveler class for the specific passenger
    if (name === "travelerClass") {
      updatedPassengers[index].travelerClass = selectedTravelerClass;
    }

    setPassengers(updatedPassengers);
  }

  function handleAddPassenger() {
    setCount(count + 1);
    setPassengers([
      ...passengers,
      {
        name: "",
        passportNumber: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        travelerClass: selectedTravelerClass,
        seatNumber: 1, // Default seat number
      },
    ]);
    // Add a new error object for the new passenger
    setErrors([...errors, {}]);
    // Update checkDisabled here
    setCheckDisabled(false);
  }

  const navigate = useNavigate();
  function handleBookingProcess(e) {
    e.preventDefault();

    // Validation checks
    const passengerErrors = passengers.map((passenger, index) => {
      const passengerErrors = {};

      if (!passenger.name.match(/^[A-Za-z\s]+$/)) {
        passengerErrors.name = "Name must contain only letters and spaces.";
      }

      if (!passenger.passportNumber.match(/^[A-Z]\d{7}$/)) {
        passengerErrors.passportNumber =
          "Passport number must start with a capital letter and have 7 digits.";
      }

      if (!passenger.contactNumber.match(/^0\d{9}$/)) {
        passengerErrors.contactNumber =
          "Contact number must start with '0' and have 10 digits.";
      }

      if (!passenger.dateOfBirth) {
        passengerErrors.dateOfBirth = "Please select a date of birth.";
      }

      if (!passenger.gender) {
        passengerErrors.gender = "Please select a gender.";
      }

      if (!passenger.travelerClass) {
        passengerErrors.travelerClass = "Please select a traveler class.";
      }

      if (passenger.seatNumber === 0) {
        passengerErrors.seatNumber = "Please select a seat number.";
      }

      // Check if the seat is already booked by another passenger in the same class
      const seatAlreadyBooked = passengers.some(
        (otherPassenger, otherIndex) => {
          return (
            otherIndex !== index && // Make sure we're not comparing the passenger with itself
            otherPassenger.seatNumber === passenger.seatNumber && // Same seat
            otherPassenger.travelerClass === passenger.travelerClass // Same class
          );
        }
      );

      if (seatAlreadyBooked) {
        passengerErrors.seatNumber =
          "This seat is already booked by another passenger in the same class.";
      }
      return passengerErrors;
    });

    // Check if any passenger has errors
    const hasErrors = passengerErrors.some(
      (errorObj) => Object.keys(errorObj).length > 0
    );

    if (hasErrors) {
      setErrors(passengerErrors);
    } else {
      // All fields are valid
      setErrors([]); // Clear any previous errors
      // Proceed to payment
      const newPassengers = passengers.map((passenger, index) => {
        passenger.travelerClass = newTravel;
      });
      navigate("/Payment", { state: { flightID, newPassengers, email } });
    }
  }

  console.log(flightID);

  return (
    <div className="BookingPage">
      <h1 className="BookingState">Booking Section</h1>
      <div className="CountSection">
        <p className="Bookingp">
          <strong>Number of Passengers : </strong>
          {count}
          <button className="BookingButton" onClick={handleAddPassenger}>
            +
          </button>
          <button className="BookingButton" onClick={HandleDecrease}>
            -
          </button>
          <p>
            <strong>Aircraft: {flightModel}</strong>
          </p>
          <label>
            Select Traveler Class:
            <select
              value={selectedTravelerClass}
              onChange={(e) => setSelectedTravelerClass(e.target.value)}
            >
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="Platinum">Platinum</option>
            </select>
          </label>
        </p>
      </div>
      <div className="PassengerDetailsContainer">
        {passengers.map((passenger, index) => (
          <div key={index} className="PassengerDetails">
            <h2>Passenger {index + 1} Details</h2>
            <div className="NamePassportInput">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={passenger.name}
                onChange={(e) => handlePassengerDetailsChange(e, index)}
              />
              {errors[index] && errors[index].name && (
                <p className="ErrorText">{errors[index].name}</p>
              )}
              <label>Passport Number:</label>
              <input
                type="text"
                name="passportNumber"
                value={passenger.passportNumber}
                onChange={(e) => handlePassengerDetailsChange(e, index)}
              />
              {errors[index] && errors[index].passportNumber && (
                <p className="ErrorText">{errors[index].passportNumber}</p>
              )}
            </div>
            <div className="BirthGenderInput">
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={passenger.dateOfBirth}
                onChange={(e) => handlePassengerDetailsChange(e, index)}
              />
              {errors[index] && errors[index].dateOfBirth && (
                <p className="ErrorText">{errors[index].dateOfBirth}</p>
              )}
              <label>Gender:</label>
              <select
                name="gender"
                value={passenger.gender}
                onChange={(e) => handlePassengerDetailsChange(e, index)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors[index] && errors[index].gender && (
                <p className="ErrorText">{errors[index].gender}</p>
              )}
            </div>
            <div className="ContactClassInput">
              <label>Contact Number:</label>
              <input
                type="text"
                name="contactNumber"
                value={passenger.contactNumber}
                onChange={(e) => handlePassengerDetailsChange(e, index)}
              />
              {errors[index] && errors[index].contactNumber && (
                <p className="ErrorText">{errors[index].contactNumber}</p>
              )}
              <label>Seat Number:</label>
              <select
                name="seatNumber"
                value={passenger.seatNumber}
                onChange={(e) => handlePassengerDetailsChange(e, index)}
              >
                {availableSeats.map((seat) => (
                  <option key={seat} value={seat}>
                    {seat}
                  </option>
                ))}
              </select>
              {errors[index] && errors[index].seatNumber && (
                <p className="ErrorText">{errors[index].seatNumber}</p>
              )}
            </div>
          </div>
        ))}
        <div>
          {count === 0 ? (
            <button className="ProceedtoPayment" disabled={true}>
              Proceed to Payment
            </button>
          ) : (
            <button
              className="ProceedtoPayment"
              onClick={handleBookingProcess}
              disabled={checkDisabled}
            >
              Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
