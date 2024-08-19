const mysql = require("../mysql-connector");

/**
 * Removes seconds part of a time string
 * @example "10:20:00" --> "10:20"
 * @param {string} time
 *
 */
function removeSecondsFromTime(time) {
  return time.split(":").slice(0, 2).join(":");
}

/**
 * @param {Date} date
 */
function getDateString(date) {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ].join("-");
}

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
  const { from, to } = request.query;

  if (typeof from != "string" || typeof to != "string") {
    response
      .status(400)
      .send(`Unexpected value received for either startDate or endDate`);
    return;
  }

  mysql.query(
    `CALL GetFlightDetailsByRoute(?, ?)`,
    [from, to],
    (error, results) => {
      if (error) {
        console.error(error);
        response.status(500).send("Internal error occured");
        return;
      }
      const items = new Array(results[0].length);
      for (let i = 0; i < results[0].length; i++) {
        const flightInfo = results[0][i];
        console.log(flightInfo);

        items[i] = {
          from,
          to,
          // TODO the procedure should be altered to include the model name as well
          model: flightInfo.Flight_ID,
          date: getDateString(flightInfo.Schedule_date),
          departure_time: removeSecondsFromTime(flightInfo.Departure_time),
          arrival_time: removeSecondsFromTime(flightInfo.Arrival_time),
          passenger_count: flightInfo.Total_Passenger_count,
        };
      }
      response.status(200).send(items);
    }
  );
}

module.exports = handler;
