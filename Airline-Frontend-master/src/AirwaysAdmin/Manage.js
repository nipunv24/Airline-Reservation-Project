import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { backend } from "../utilities";
import "./Manage.css";

const Manage = ({ email }) => {
	const [adminName, setAdminName] = useState(null);
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

	useEffect(() => {
		backend("/retrieve-admin-data", {
			body: {
				emailAddress: email,
			},
		}).then((user) => {
			if (typeof user == "string") {
				console.error(user);
				return;
			}
			setAdminName(user.name);
		});
	}, [email]);

	return (
		<div className="ManageTag">
			<h1 className="ManageHeader">Welcome Back {adminName}</h1>
			<div className="ManageDiv">
				<div className="ManageSchedule">
					<Link to={"/DelayManage"} className="ManageLink">
						Manage the Flight Schedule
					</Link>
				</div>
				<div className="SearchByFlights">
					<Link to={"/SearchByFlight"} className="ManageLink">
						Search Passengers by Flight
					</Link>
				</div>
				<div className="SearchByDates">
					<Link to={"/SearchByDate"} className="ManageLink">
						Search Passengers by Date
					</Link>
				</div>
				<div className="SearchBookingTag">
					<Link to={"/SearchBookings"} className="ManageLink">
						Search Bookings by Date
					</Link>
				</div>
				<div className="SearchByRoute">
					<Link to={"/RouteSearch"} className="ManageLink">
						Search By Route
					</Link>
				</div>
				<div className="AircraftRevenueTag">
					<Link to={"/Revenue"} className="ManageLink">
						Aircraft Revenue
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Manage;
