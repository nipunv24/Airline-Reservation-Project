const bcrypt = require("bcrypt");

const mysql = require("../mysql-connector");
const { BCRYPT_SALT_ROUNDS } = require("../values");

/**
 * @typedef NewUserDetailsObj
 * @prop {string} name
 * @prop {string} address
 * @prop {string} email
 * @prop {string} password
 * @prop {string} birthday
 * @prop {string} NIC
 * @prop {string} phoneNumber
 * @prop {string} passport
 */

/**
 * @param {import("express").Request<import("express-serve-static-core").RouteParameters<"create-user">, unknown, NewUserDetailsObj>} request
 * @param {import("express").Response} response
 */
async function handler(request, response) {
  let { name, address, email, password, birthday, NIC, phoneNumber, passport } =
    request.query;
  console.log(request.query);

  password = typeof password == "string" ? password : "";

  if (
    typeof name != "string" ||
    typeof address != "string" ||
    typeof email != "string" ||
    typeof password != "string" ||
    typeof phoneNumber != "string" ||
    typeof passport != "string"
  ) {
    console.log({ name, address, email, password, phoneNumber, passport });
    response.status(400).send("Not all required fields are given");
    return;
  }

  const userId = await new Promise((resolve, reject) => {
    mysql.query("SELECT COUNT(*) FROM User", (error, result) => {
      if (error) {
        console.error(error);
        reject("Internal server error occured");
        return;
      }
      const count = result[0]["COUNT(*)"];
      console.log("user total count", count);
      if (typeof count != "number") {
        throw new Error(
          `count is expected to be a number, got ${count} instead`
        );
      }
      resolve((count + 1).toString().padStart(4, "0"));
    });
  });
  console.log("userId", userId);
  /** @type {string | null} */

  const hashedPassword = await new Promise((resolve) => {
    if (typeof password != "string") {
      resolve(null);
      return;
    }
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (err, hash) => {
      if (err) {
        console.error(err);
        resolve(null);
      }
      resolve(hash);
    });
  });
  if (hashedPassword == null) {
    response.status(500).send("Internal server error occured");
    return;
  }
  console.log("hashedPassword", hashedPassword);

  mysql.query(
    "INSERT INTO User (User_ID, Email_address, Password, Name, Address, Birthday, NIC, Phone_number, Passport_number, Membership_type, Travel_Count, Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      userId,
      email,
      hashedPassword,
      name,
      address,
      birthday,
      NIC,
      phoneNumber,
      passport,
      // TODO
      "Frequent",
      0,
      "Registered",
    ],
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
