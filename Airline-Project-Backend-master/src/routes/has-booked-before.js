const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
	const passportNumber = request.query.passportNumber;

	if (passportNumber == undefined) {
		response.status(400).send("passport-number parameter is missing");
		return;
	}

	mysql.query(
		"SELECT * FROM User WHERE Passport_number = ?",
		[passportNumber],
		(error, results) => {
			if (error) {
				console.error(error);
				response.status(500).send("Internal server error occured");
				return;
			}

			const hasBookedBefore = results.length != 0;
			response.status(200).send({ hasBookedBefore });
		}
	);
}

module.exports = handler;
