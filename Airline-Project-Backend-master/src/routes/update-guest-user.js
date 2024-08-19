const mysql = require("../mysql-connector");

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
async function handler(request, response) {
  await new Promise((resolve, reject) => {
    const {
      guestID,
      name,
      email_address,
      address,
      phone_number,
      passport_number,
    } = request.body;
    console.log(request.body);

    mysql.query(
      `Insert into user (User_ID,Name,Email_address,Address,Phone_number,Passport_number,Password,Birthday,NIC,Membership_type,Travel_Count,Role) values (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        guestID,
        name,
        email_address,
        address,
        phone_number,
        passport_number,
        "NULL",
        "1900-01-01",
        null,
        null,
        0,
        "Guest",
      ],
      (err, results) => {
        if (err) {
          console.error(err);
          response.status(500).send("Internal server error occured");
          reject();
          return;
        }
        resolve();
      }
    );
  });
}

module.exports = handler;
