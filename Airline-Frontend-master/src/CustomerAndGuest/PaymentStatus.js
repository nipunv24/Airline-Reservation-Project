import React, { useState } from "react";
import "./PaymentStatus.css";

const PaymentStatus = ({ tickets }) => {
  // const [ticketInfo, setTicketInfo] = useState([
  //   {
  //     Ticket_Number: "0001",
  //     Gate_number: 1,
  //     name: "Mary Jane",
  //     aircraft_model: "Boeing 737-150",
  //     seat_number: "A1",
  //   },
  //   {
  //     Ticket_Number: "0002",
  //     Gate_number: 1,
  //     name: "John Wick",
  //     aircraft_model: "Boeing 757-200",
  //     seat_number: "A54",
  //   },
  //   {
  //     Ticket_Number: "0003",
  //     Gate_number: 2,
  //     name: "John Cena",
  //     aircraft_model: "Airbus A380",
  //     seat_number: "A20",
  //   },
  //   {
  //     Ticket_Number: "0004",
  //     Gate_number: 3,
  //     name: "Randall Park",
  //     aircraft_model: "Boeing 737-150",
  //     seat_number: "A1",
  //   },
  // ]);

  function handleLogOut() {
    window.location.href = "/Thanking";
  }

  return (
    <div className="PaymentStatusDiv">
      <div className="PaymentStatusTag">
        <div className="PaymentStatusHeader">
          <h1>Payment Status</h1>
        </div>
        <div className="PaymentStatusMessage">
          <h2>Payment Successful!</h2>
        </div>
      </div>

      <div className="TicketDetailsTable">
        <table>
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Gate Number</th>
              <th>Name</th>
              <th>Aircraft Model</th>
              <th>Seat Number</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticketNo}>
                <td>{ticket.ticketNo}</td>
                <td>{ticket.gateNo}</td>
                <td>{ticket.name}</td>
                <td>{ticket.aircraftModel}</td>
                <td>{ticket.seatNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="ProceedtoLogOut" onClick={handleLogOut}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;
