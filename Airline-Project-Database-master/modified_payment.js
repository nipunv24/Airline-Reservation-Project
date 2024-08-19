/*payment.js*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import "./Payment.css";

const Payment = ({ passengers, flightID, count, email }) => {
  const [totalPayment, setTotalPayment] = useState(2500);
  const [paymentUser, setPaymentUser] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    user_id: "",
    name: "",
    email_address: "",
    address: "",
    phone_number: "",
    passport_number: "",
    travel_count: 1,
  });
  const [isDetailsSubmitted, setIsDetailsSubmitted] = useState(false);
  const [membership_type, setMembership_type] = useState(null);
  const [travel_count, setTravel_count] = useState(null);
  const [userID, setUserID] = useState(null);
  const [guestUserID, setGuestUserID] = useState(null);
  const [guestMessage, setGuestMessage] = useState(null);
  const [isPaymentComplete, setIsPaymentComplete] = useState(true);
  /*Need an internet connection for payment process. Card number :- 4242 4242 4242 4242*/

  const users = [
    {
      user_id: "0001",
      email_address: "visitha@gmail.com",
      password: "12345",
      name: "Visitha Wickramasinghe",
      address: "123 Main Street, Cityville",
      birthday: "1990-01-15",
      NIC: "123456789012",
      phone_number: "0786546789",
      passport_number: "AB123456",
      membership_type: "frequent",
      travel_count: 1,
      role: "registered",
    },
    {
      user_id: "0002",
      email_address: "jane@gmail.com",
      password: "strongpassword456",
      name: "Jane Smith",
      address: "456 Elm Street, Townsville",
      birthday: "1985-05-20",
      NIC: "987654321098",
      phone_number: "0987543210",
      passport_number: "CD789012",
      membership_type: "gold",
      travel_count: 15,
      role: "registered",
    },
    {
      user_id: "0003",
      email_address: "guest@gmail.com",
      password: "guestpass123",
      name: "Guest User",
      address: "789 Oak Avenue, Villagetown",
      birthday: null,
      NIC: null,
      phone_number: "05551234567",
      passport_number: null,
      membership_type: null,
      travel_count: null,
      role: "guest",
    },
  ];

  const FlightsDetails = [
    {
      flight_id: "F0001",
      model: "Airbus A380",
      aircraft_id: "A0001",
      Economy_seat_count: 420,
      Business_seat_count: 95,
      Platinum_seat_count: 10,
    },
    {
      flight_id: "F0002",
      model: "Boeing 757-200",
      aircraft_id: "B0002",
      Economy_seat_count: 170,
      Business_seat_count: 22,
      Platinum_seat_count: 8,
    },
    {
      flight_id: "F0003",
      model: "Boeing 737-150",
      aircraft_id: "B0003",
      Economy_seat_count: 130,
      Business_seat_count: 27,
      Platinum_seat_count: 5,
    },
  ];

  useEffect(() => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email_address === email) {
        setPaymentUser(users[i].name);
        setTravel_count(users[i].travel_count);
        setMembership_type(users[i].membership_type);
        setUserID(users[i].user_id);
        break;
      }
    }

    if (email === null) {
      setPaymentUser("Guest");
    }
  }, [email]);

  const handleNameChange = (e) => {
    setGuestInfo({ ...guestInfo, name: e.target.value });
  };

  const handleEmailChange = (e) => {
    setGuestInfo({ ...guestInfo, email_address: e.target.value });
  };

  const handleAddressChange = (e) => {
    setGuestInfo({ ...guestInfo, address: e.target.value });
  };

  const handlePhoneNumberChange = (e) => {
    setGuestInfo({ ...guestInfo, phone_number: e.target.value });
  };

  const handlePassportNumberChange = (e) => {
    setGuestInfo({ ...guestInfo, passport_number: e.target.value });
  };

  const handleSubmitDetails = () => {
    // Validate guest details if needed
    if (
      guestInfo.name === "" ||
      guestInfo.email_address === "" ||
      guestInfo.address === "" ||
      guestInfo.phone_number === "" ||
      guestInfo.passport_number === ""
    ) {
      alert("Please fill all the fields");
    } else {
      const matchingUser = users.find(
        (user) => user.passport_number === guestInfo.passport_number
      );
      if (matchingUser) {
        setGuestMessage(
          "A Guest can create a booking only once. You have booked a flight previously. Create an account to create more bookings."
        );
      } else {
        const guest_id = generateGuestUserID();
        setGuestUserID(guest_id);
        guestInfo.user_id = guest_id;
        setGuestMessage("Details submitted successfully");
      }
    }
    // This data should be sent to the database (to store in the user table)
  };

  const navigate = useNavigate();
  function handlePaymentComplete() {
    navigate("/PaymentStatus");
  }

  function generateGuestUserID() {
    return `GUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function generateBookingID() {
    return `BOOKING-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function generateTicketNumber() {
    return `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function generatePaymentID() {
    return `PAYMENT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function generateGateNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const onToken = async (token) => {
    console.log(token);

    // Create a new booking_id
    const booking_id = generateBookingID(); // Implement a function to generate a unique ID

    // Get the flight_id from flightDetails based on flightID
    const selectedFlight = FlightsDetails.find(
      (flight) => flight.flight_id === flightID
    );

    if (!selectedFlight) {
      console.error("Invalid flight ID");
      return;
    }

    // Create Ticket objects for each passenger
    const tickets = passengers.map((passenger) => {
      return {
        ticketNo: generateTicketNumber(), // Implement a function to generate a unique ticket number
        issuedDate: getCurrentDate(),
        gateNo: generateGateNumber(), // Implement a function to generate a gate number
        seatNumber: passenger.seatNumber,
        flight_id: flightID,
        travelerClass: passenger.travelerClass,
        bookingID: booking_id,
        passportNumber: passenger.passportNumber,
      };
    });

    // Create a Booking object
    const booking = {
      bookingID: booking_id,
      flight_id: selectedFlight.flight_id,
      user_id: userID || guestUserID,
      count: count,
      travelerClass: passengers[0].travelerClass, // Assuming all passengers have the same class
    };

    // Create a Payment object
    const payment = {
      paymentID: generatePaymentID(), // Implement a function to generate a unique payment ID
      price: totalPayment,
      status: "Success", // You can set the status as needed
    };

    // Create a Seat Selection object for each passenger
    const seatSelections = passengers.map((passenger) => {
      const aircraft = FlightsDetails.find(
        (flight) => flight.flight_id === flightID
      );
      return {
        seatNumber: passenger.seatNumber,
        flight_id: flightID,
        travelerClass: passenger.travelerClass,
        availability: "Booked", // Set the availability as needed
      };
    });

    setIsPaymentComplete(false);

    console.log(tickets);
    console.log(booking);
    console.log(payment);
    console.log(seatSelections);
    console.log(guestInfo);
    /* Here we need to send the user_id to the database. In there we increase the travel count by 1 and then 
    check whether the travel count is 10. If it is 10, we change the membership type to gold. */

    // Combine all the data into a single payload

    /*const postData = {
      tickets,
      booking,
      payment,
      seatSelections,
      passengers,
      user_id (for a registered customer)
      guestInfo (for a guest customer)
    };

    // Send the POST request to your backend (replace 'YOUR_BACKEND_URL' with the actual URL)
    try {
      const response = await fetch("YOUR_BACKEND_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        console.log("Payment data successfully sent to the server.");
        // You can now navigate to the payment status page or perform any other actions.
        handlePaymentComplete();
      } else {
        console.error("Failed to send payment data to the server.");
      }
    } catch (error) {
      console.error("Error while sending payment data:", error);
    }*/
  };

  console.log(passengers);

  return (
    <div className="PaymentPage">
      <div className="PaymentContainer">
        <h1 className="PaymentHeader">Payment Section</h1>
        <h2 className="Greeting">Hello {paymentUser}</h2>

        {email === null && (
          <div className="GuestInfo">
            <p className="GuestFormState">
              <strong>Please fill these before the payment process</strong>
            </p>
            <input
              type="text"
              placeholder="Name"
              value={guestInfo.name}
              onChange={handleNameChange}
              required
            />
            <input
              type="text"
              placeholder="Email"
              value={guestInfo.email}
              onChange={handleEmailChange}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={guestInfo.address}
              onChange={handleAddressChange}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={guestInfo.phone_number}
              onChange={handlePhoneNumberChange}
              required
            />
            <input
              type="text"
              placeholder="Passport Number"
              value={guestInfo.passport_number}
              onChange={handlePassportNumberChange}
              required
            />
            <button
              className="PaymentGuestSubmit"
              onClick={handleSubmitDetails}
            >
              Submit Details
            </button>
            <p>{guestMessage}</p>
          </div>
        )}

        <div className="PaymentArea">
          <h3 className="paymentSubHeader">
            Total Payment: {"USD "}
            {totalPayment}
          </h3>
          <StripeCheckout
            token={onToken}
            name="Confirm Your Payment"
            currency="USD"
            amount={totalPayment * 100}
            stripeKey="pk_test_51O1PqASJuhyVF5DPxufZkaTYQEXzEXkeOa8vQNNT9gaR2RiN2VNsbenAyIY5IQbXC0d7llJhZfvVtZfvgNOG75w100XkSyooIy"
          />
        </div>
      </div>
      <div className="PaymentProceedContainer">
        <button
          className="PaymentButtonProceedClick"
          onClick={handlePaymentComplete}
          disabled={isPaymentComplete}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Payment;
