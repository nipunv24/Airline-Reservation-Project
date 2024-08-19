const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
	mysql.query(
		`SELECT 
			AR.Aircraft_ID AS aircraft_id,
			AR.Revenue AS revenue,
			AM.Model AS model
		FROM AircraftRevenue AS AR
		LEFT JOIN Aircraft
		ON Aircraft.Aircraft_ID = AR.Aircraft_ID
		LEFT JOIN Aircraft_Models AS AM
		ON Aircraft.Model_ID = AM.Model_ID`,
		(error, results) => {
			if (error || !Array.isArray(results)) {
				console.error(error);
				response.status(500).send("Internal server error occured");
				return;
			}

			response
				.status(200)
				.setHeader("Content-Type", "application/json")
				.send(results);
		}
	);
}

module.exports = handler;
