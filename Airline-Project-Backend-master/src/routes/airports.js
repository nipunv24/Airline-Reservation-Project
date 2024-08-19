const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
	mysql.query(
		"SELECT * FROM Airport RIGHT JOIN Address ON Airport.Address_ID = Address.Address_ID",
		(error, results) => {
			if (error || !Array.isArray(results)) {
				console.error(error);
				response.status(500).send("Internal server error occured");
				return;
			}

			const airports = [];

			for (let i = 0; i < results.length; i++) {
				const item = results[i];
				if (item.Airport_code == null) continue;

				let name = item.Name;
				let currentParentId = item.Parent_ID;
				while (currentParentId != null) {
					const parentAddress = results.find((result) => {
						return (
							result.Address_ID == currentParentId &&
							result.Airport_code == null
						);
					});

					name = name.concat(", ", parentAddress.Name);
					currentParentId = parentAddress.Parent_ID;
				}
				name = name.concat(` (${item.Airport_code})`);
				airports.push({
					code: item.Airport_code,
					name,
				});
			}

			response
				.status(200)
				.setHeader("Content-Type", "application/json")
				.send(airports);
		}
	);
}

module.exports = handler;
