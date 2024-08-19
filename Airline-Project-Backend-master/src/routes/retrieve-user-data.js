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
		"SELECT * FROM User WHERE Email_address = ?",
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
				user_id: d.User_ID,
				email_address: d.Email_address,
				name: d.Name,
				address: d.Address,
				birthday: d.Birthday,
				NIC: d.NIC,
				phone_number: d.Phone_number,
				passport_number: d.Passport_number,
				membership_type: d.Membership_type,
				travel_count: d.Travel_Count,
				role: d.Role,
			};
			response.status(200).send(user);
		}
	);
}

module.exports = handler;
