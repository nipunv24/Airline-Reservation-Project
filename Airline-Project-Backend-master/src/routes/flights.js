const mysql = require("../mysql-connector");

/** @param {Date} date */
function formatDate(date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0"),
		day = "" + date.getDate().toString().padStart(2, "0"),
		year = date.getFullYear();

	return `${year}-${month}-${day}`;
}

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
	mysql.query(
		"SELECT * FROM `Flight Schedule` LEFT JOIN Route ON Route.Route_ID = `Flight Schedule`.Route_ID",
		(error, results) => {
			if (error || !Array.isArray(results)) {
				console.error(error);
				response.status(500).send("Internal server error occured");
				return;
			}

			for (let i = 0; i < results.length; i++) {
				results[i] = {
					from: results[i]["Origin_airport"],
					to: results[i]["Destination_airport"],
					date: formatDate(new Date(results[i]["Schedule_date"])),
					depature_time: results[i]["Departure_time"],
					arrival_time: results[i]["Arrival_time"],
					flightID: results[i]["Flight_ID"],
				};
			}
			response
				.status(200)
				.setHeader("Content-Type", "application/json")
				.send(results);
		}
	);
}

module.exports = handler;
