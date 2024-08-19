const { Console } = require("console");
const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
async function handler(request, response) {
  // When the flightId is passed,
  // Only the matching flight information is returned
  // Otherwise, all the flights will be returned
  const flightId = request.query.flightId || "";

  if (typeof flightId != "string") {
    response.status(400).send("Unrecognized flightId parameter");
    return;
  }

  const seatsGroupedByFlights = await new Promise((resolve, reject) => {
    mysql.query(
      `SELECT
					*
				FROM \`Seat Selection\` AS SS
				WHERE SS.Availability = 'No'`,
      (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        //Console.log("result", results);

        /**
         * @type {Record<string, Record<string, Array<number>>>}
         */
        const seatsGroupedByFlights = {};

        for (let i = 0; i < results.length; i++) {
          const item = results[i];
          const flightId = item["Flight_ID"];
          const seatClass = item["Traveler_Class"];
          if (seatsGroupedByFlights[flightId] == undefined) {
            seatsGroupedByFlights[flightId] = {
              Economy: [],
              Business: [],
              Platinum: [],
            };
          }

          if (seatsGroupedByFlights[flightId][seatClass] == undefined) {
            seatsGroupedByFlights[flightId][seatClass] = [];
          }

          seatsGroupedByFlights[flightId][seatClass].push(item.Seat_Number);
        }

        resolve(seatsGroupedByFlights);
      }
    );
  });

  mysql.query(
    `SELECT
			FS.Flight_ID AS flightId,
			AM.Model AS model,
			AM.Economy_seat_count,
			AM.Business_seat_count,
			AM.Platinum_seat_count,
			A.Aircraft_ID AS aircraft_id
		FROM
			\`Flight Schedule\` AS FS
		LEFT JOIN
			Aircraft AS A ON FS.Aircraft_ID = A.Aircraft_ID
		LEFT JOIN
			Aircraft_Models AS AM ON A.Model_ID = AM.Model_ID
		WHERE ? OR FS.Flight_ID = ?`,
    [flightId == "", flightId],
    (error, results) => {
      if (error || !Array.isArray(results)) {
        console.error(error);
        response.status(500).send("Internal server error occured");
        return;
      }

      if (results.length == 0) {
        response.status(500).send("No such flight is found");
        return;
      }

      for (let i = 0; i < results.length; i++) {
        results[i].bookedSeats = seatsGroupedByFlights[results[i].flightId] || {
          Economy: [],
          Business: [],
          Platinum: [],
        };
      }

      response
        .status(200)
        .setHeader("Content-Type", "application/json")
        // if flightId is provided, return matching flight only,
        // otherwise return all flights
        .send(flightId == "" ? results : results[0]);
    }
  );
}

module.exports = handler;
