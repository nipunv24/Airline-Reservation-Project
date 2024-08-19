const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
	const { destination, startDate, endDate } = request.query;

	if (typeof destination != "string") {
		response
			.status(400)
			.send(`Unexpected value received for destination (${destination})`);
		return;
	}
	if (typeof startDate != "string") {
		response
			.status(400)
			.send(`Unexpected value received for startDate (${startDate})`);
		return;
	}
	if (typeof endDate != "string") {
		response
			.status(400)
			.send(`Unexpected value received for endDate (${endDate})`);
		return;
	}
	mysql.query(
		`CALL GetPassengersByDestination(?, ?, ?)`,
		[destination, startDate, endDate],
		(error, results) => {
			if (error) {
				console.error(error);
				response.status(500).send("Internal error occured");
				return;
			}
			const items = results[0];
			const alteredItems = new Array(items.length);
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				alteredItems[i] = {

					passportNumber: item.Passport_number,
					name: item.Name,
					Date_of_Birth: item.DOB,
					contactNo: item.Phone_number,
					Destination_airport: item.Destination_airport,
					Schedule_date: item.Schedule_date,
				};
			}
			response.status(200).send(alteredItems);
		}
	);
}

module.exports = handler;
