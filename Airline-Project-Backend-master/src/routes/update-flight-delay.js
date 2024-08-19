const mysql = require("../mysql-connector");

/** @param {Date} date */
function formatDate(date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0"),
		day = "" + date.getDate().toString().padStart(2, "0"),
		year = date.getFullYear();

	return `${year}-${month}-${day}`;
}

function generateDelayId() {
	return `D-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
	const { flightId, reason, delayInMinutes } = request.query;
	const delayId = generateDelayId();

	if (
		flightId == undefined ||
		reason == undefined ||
		delayInMinutes == undefined
	) {
		response.status(400).send("Not all required data is provided");
		return;
	}
	if (typeof delayInMinutes != "string") {
		response.status(500).send("Internal error occured");
		return;
	}
	let _delayInMinutes = parseInt(delayInMinutes);
	if (Number.isNaN(_delayInMinutes)) {
		response
			.status(400)
			.send(
				`delayInMinutes is expected to be a number, got ${delayInMinutes} instead`
			);
		return;
	}

	mysql.query(
		`INSERT INTO
			FlightDelaysEntity
			(DelayID, Flight_ID, Delay_reason, Delay_minutes, Notification_sent, Notification_time)
		VALUES (?, ?, ?, ?, 'No', ?)`,
		[delayId, flightId, reason, delayInMinutes, new Date().toISOString()],
		(error) => {
			if (error) {
				console.error(error);
				response.status(500).send("Internal server error occured");
				return;
			}
			response.status(200).send("done");
		}
	);
}

module.exports = handler;
