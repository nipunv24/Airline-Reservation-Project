const bcrypt = require("bcrypt");
const mysql = require("../mysql-connector");

function checkLogin(response, emailAddress, password, tableName) {
  return new Promise((resolve) => {
    mysql.query(
      `SELECT * FROM ${tableName} WHERE Email_address = ?`,
      [emailAddress],
      (error, results) => {
        console.log("password", bcrypt.hash("password", 10));
        if (error) {
          response.status(500).send("Internal server error occured");
          resolve(true);
          return;
        }
        const user = results[0];
        if (typeof user == "undefined") {
          resolve(false);
          return;
        }

        bcrypt.compare(password, user.Password, (err, result) => {
          if (err) {
            console.error(err);
            response.status(500).send("Internal server error occured");
            resolve(true);
            return;
          }

          if (result == false) {
            response.status(400).send("Invalid credentials");
            resolve(true);
            return;
          }

          delete user.Password;
          user.isAdmin = tableName == "Admin";
          response.status(200).send(user);
          resolve(true);
        });
      }
    );
  });
}

async function handler(request, response) {
  const { emailAddress, password } = request.query;

  if (typeof emailAddress != "string" || typeof password != "string") {
    response.status(400).send("Email address or password is missing");
    return;
  }

  /**
   * @param {"Admin" | "User"} checkingInTable
   * @returns whether the response has been sent
   */
  let responseSent = false;
  responseSent = await checkLogin(response, emailAddress, password, "User");
  if (responseSent) {
    return;
  }

  responseSent = await checkLogin(response, emailAddress, password, "Admin");
  if (responseSent) {
    return;
  }
  // user doesn't exist
  response.status(400).send("Invalid credentials");
}

module.exports = handler;
