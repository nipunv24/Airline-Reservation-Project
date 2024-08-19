const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
async function handler(request, response) {
  const { tickets, booking, payment, seatSelections, passengers, userId } =
    request.body;

  if (!Array.isArray(tickets)) {
    response.status(400).send("Invalid request");
  }
  let responseSent = false;

  // insert payment details
  await new Promise((resolve, reject) => {
    mysql.query(
      `CALL InsertPaymentDetails(?,?,?)`,
      [payment.paymentId, payment.price, payment.status],
      (err, results) => {
        if (err) {
          console.error(err);
          response.status(500).send("Internal server error occured");
          reject();
          return;
        }
        resolve();
      }
    );
  });

  // insert booking details
  await new Promise((resolve, reject) => {
    const data1 = [
      booking.bookingID,
      booking.flight_id,
      booking.user_id,
      booking.count,
      booking.travelerClass,
      booking.paymentId,
    ];
    console.log(data1);
    mysql.query(
      `CALL InsertBookingDetails(?,?,?,?,?,?)`,
      data1,
      (err, results) => {
        if (err) {
          console.error(err);
          response.status(500).send("Internal server error occured");
          reject();
          return;
        }
        resolve();
      }
    );
  });

  // insert seat selection details
  await Promise.all(
    seatSelections.map((seatSelection) => {
      return new Promise((resolve, reject) => {
        console.log(seatSelection);
        mysql.query(
          `CALL InsertSeatSelectionDetails(?,?,?,?)`,
          [
            seatSelection.seatNumber,
            seatSelection.flight_id,
            seatSelection.travelerClass,
            seatSelection.availability,
          ],
          (err) => {
            if (err) {
              console.error(err);
              response.status(500).send("Internal server error occured");
              responseSent = true;
              reject(err);
              return;
            }
            resolve();
          }
        );
      });
    })
  );

  // insert passenger details
  await Promise.all(
    passengers.map((passenger) => {
      return new Promise((resolve, reject) => {
        mysql.query(
          `CALL InsertPassengerDetails(?,?,?,?,?)`,
          [
            passenger.passportNumber,
            passenger.name,
            passenger.dateOfBirth,
            passenger.gender,
            passenger.contactNumber,
          ],
          (err) => {
            if (err) {
              console.error(err);
              response.status(500).send("Internal server error occured");
              responseSent = true;
              reject(err);
              return;
            }
            resolve();
          }
        );
      });
    })
  );

  // insert ticket details
  await Promise.all(
    tickets.map((ticket) => {
      return new Promise((resolve, reject) => {
        mysql.query(
          `CALL InsertTicketDetails(?,?,?,?,?,?,?,?)`,
          [
            ticket.ticketNo,
            ticket.issuedDate,
            ticket.gateNo,
            ticket.seatNumber,
            ticket.flight_id,
            ticket.travelerClass,
            ticket.bookingID,
            ticket.passportNumber,
          ],
          (err) => {
            if (err) {
              console.error(err);
              response.status(500).send("Internal server error occured");
              responseSent = true;
              reject(err);
              return;
            }
            resolve();
          }
        );
      });
    })
  );

  response.status(200).send("done");
}

module.exports = handler;
