const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
	const { startDate, endDate } = request.query;

	if (typeof startDate != "string" || typeof endDate != "string") {
		response
			.status(400)
			.send(`Unexpected value received for either startDate or endDate`);
		return;
	}

	mysql.query(
		`CALL GetPassengersCountByClass(?, ?)`,
		[startDate, endDate],
		(error, results) => {
			if (error) {
				console.error(error);
				response.status(500).send("Internal error occured");
				return;
			}
			response.status(200).send(results[0][0]);
		}
	);
}

module.exports = handler;
