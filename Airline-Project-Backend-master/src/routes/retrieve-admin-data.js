const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
	const emailAddress = request.query.emailAddress;

	if (emailAddress == undefined) {
		response.status(400).send("email address is missing");
		return;
	}

	mysql.query(
		"SELECT Name FROM Admin WHERE Email_address = ?",
		[emailAddress],
		(error, results) => {
			if (error) {
				console.error(error);
				response.status(500).send("Internal server error occured");
				return;
			}

			const isRegisteredUser = results.length != 0;
			if (!isRegisteredUser) {
				response.status(400).send("The user is not found in our database");
				return;
			}
			const d = results[0];
			const user = {
				name: d.Name,
			};
			response.status(200).send(user);
		}
	);
}

module.exports = handler;
