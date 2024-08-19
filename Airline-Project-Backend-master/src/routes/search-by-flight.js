const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
function handler(request, response) {
  const { flightId, ageCategory } = request.query;
  console.log(flightId, ageCategory);

  if (typeof flightId != "string") {
    response
      .status(400)
      .send(`Unexpected value received for flightId (${flightId})`);
    return;
  }
  if (
    typeof ageCategory != "string" ||
    (ageCategory != "above18" && ageCategory != "below18")
  ) {
    response
      .status(400)
      .send(`Unexpected value received for ageCategory (${ageCategory})`);
    return;
  }
  let procedureName = "GetPassengersAbove18";
  if (ageCategory == "below18") {
    procedureName = "GetPassengersBelow18";
  }
  mysql.query(`CALL ${procedureName}(?)`, [flightId], (error, results) => {
    if (error) {
      console.error(error);
      response.status(500).send("Internal error occured");
      return;
    }
    const items = results[0];
    const alteredItems = new Array(items.length);
    console.log(items);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      alteredItems[i] = {
        passportNumber: item.Passport_No,
        name: item.Name,
        Date_of_Birth: item.DOB,
        contactNo: item.Contact_No,
      };
    }
    response.status(200).send(alteredItems);
  });
}

module.exports = handler;
