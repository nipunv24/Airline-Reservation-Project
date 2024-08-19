import { useNavigate } from "react-router-dom";
import password_icon from "../Assets/password.png";
import email_icon from "../Assets/email.png";
import React, { useEffect, useState } from "react";
import { backend } from "../utilities";
import "./Logincustadmin.css";

const Logincustadmin = ({ setEmail }) => {
	const [error, setError] = useState(null);
	const [email, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	// const [users, setUsers] = useState([
	// 	{
	// 		user_id: "0001",
	// 		email_address: "visitha@gmail.com",
	// 		password: "12345",
	// 		name: "Visitha Wickramasinghe",
	// 		address: "123 Main Street, Cityville",
	// 		birthday: "1990-01-15",
	// 		NIC: "123456789012",
	// 		phone_number: "0786546789",
	// 		passport_number: "AB123456",
	// 		membership_type: "frequent",
	// 		travel_count: 1,
	// 		role: "registered",
	// 	},
	// 	{
	// 		user_id: "0002",
	// 		email_address: "jane@gmail.com",
	// 		password: "strongpassword456",
	// 		name: "Jane Smith",
	// 		address: "456 Elm Street, Townsville",
	// 		birthday: "1985-05-20",
	// 		NIC: "987654321098",
	// 		phone_number: "0987543210",
	// 		passport_number: "CD789012",
	// 		membership_type: "gold",
	// 		travel_count: 15,
	// 		role: "registered",
	// 	},
	// 	{
	// 		user_id: "0003",
	// 		email_address: "guest@gmail.com",
	// 		password: "guestpass123",
	// 		name: "Guest User",
	// 		address: "789 Oak Avenue, Villagetown",
	// 		birthday: "2000-12-03",
	// 		NIC: "456789012345",
	// 		phone_number: "05551234567",
	// 		passport_number: null,
	// 		membership_type: null,
	// 		travel_count: null,
	// 		role: "guest",
	// 	},
	// ]);

	// const [admin, setAdmin] = useState([
	// 	{
	// 		admin_id: 1,
	// 		email_address: "admin@example.com",
	// 		password: "admin_password123",
	// 		name: "Admin Name",
	// 	},
	// 	{
	// 		admin_id: 2,
	// 		email_address: "admin2@example.com",
	// 		password: "admin_password456",
	// 		name: "Admin 2 Name",
	// 	},
	// 	{
	// 		admin_id: 3,
	// 		email_address: "admin3@example.com",
	// 		password: "admin_password789",
	// 		name: "Admin 3 Name",
	// 	},
	// ]);

	const navigate = useNavigate();

	function handleLoginClick(e) {
		e.preventDefault();

		if (email === "" || password === "") {
			return;
		}

		backend("/login", {
			body: {
				emailAddress: email,
				password,
			},
		}).then((d) => {
			console.log(d);
			if (typeof d == "string") {
				// some error
				console.error(d);
				setError("Invalid Entry");
				return;
			}
			setEmail(email);
			if (d.isAdmin) {
				navigate("/Manage");
			} else {
				console.log(email);
				navigate("/Flight");
			}
		});
	}

	/*useEffect(() => {
    fetch("http://localhost:3031/Users")
      .then((res) => {
        if (!res.ok) throw Error("Could not fetch the data for that resource");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3032/Admin")
      .then((res) => {
        if (!res.ok) throw Error("Could not fetch the data for that resource");
        return res.json();
      })
      .then((data) => {
        setAdmin(data);
        console.log(data);
      })
      .catch((err) => setError(err.message));
  }, []); */

	// function checkUserLogin() {
	// 	if (users != null) {
	// 		for (let i = 0; i < users.length; i++) {
	// 			if (
	// 				users[i].email_address === email &&
	// 				users[i].password === password
	// 			) {
	// 				return true;
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }

	// function checkAdminLogin() {
	// 	if (admin != null) {
	// 		for (let i = 0; i < admin.length; i++) {
	// 			if (
	// 				admin[i].email_address === email &&
	// 				admin[i].password === password
	// 			) {
	// 				return true;
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }

	return (
		<div className="Loginbody">
			<div className="Logincontainer">
				<div className="Loginheader">
					<div className="Logintext">
						<strong>
							<h1>Login</h1>
						</strong>
					</div>
					<div className="Loginunderline"></div>
				</div>

				<form>
					<div className="Logininputs">
						<div className="inputLogin">
							<img src={email_icon} alt={"person"} />
							<input
								type="text"
								placeholder="E-mail"
								required
								value={email}
								onChange={(e) => setEmailAddress(e.target.value)}
							/>
						</div>

						<div className="inputLogin">
							<img src={password_icon} alt={"password"} />
							<input
								type="password"
								placeholder="Password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					<div className="Loginsubmit-container">
						<button onClick={(e) => handleLoginClick(e)}>Login</button>
					</div>
				</form>
				<div className="LoginErrorHandle">{error && <div>{error}</div>}</div>
			</div>
		</div>
	);
};

export default Logincustadmin;
