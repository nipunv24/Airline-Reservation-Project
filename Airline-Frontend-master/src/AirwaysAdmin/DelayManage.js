import './DelayManage.css';

import { useState } from 'react';

import { backend } from '../utilities';

const DelayManage = () => {
	const [flightID, setFlightID] = useState(null);
	const [reason, SetReason] = useState(null);
	const [delayMinutes, SetDelayMinutes] = useState(null);
	const [status, SetStatus] = useState(null);
	const [flights, setFlights] = useState([
		{
			from: "BIA",
			to: "BKK",
			date: "2023-10-07",
			depature_time: "08:00",
			arrival_time: "10:30",
			flightID: "F0001",
		},
		{
			from: "BIA",
			to: "DEL",
			date: "2023-10-08",
			depature_time: "10:00",
			arrival_time: "12:00",
			flightID: "F0002",
		},
		{
			from: "HRI",
			to: "BKK",
			date: "2023-10-08",
			depature_time: "12:00",
			arrival_time: "14:30",
			flightID: "F0003",
		},
		{
			from: "BKK",
			to: "BOM",
			date: "2023-10-09",
			depature_time: "08:00",
			arrival_time: "10:30",
			flightID: "F0004",
		},
		{
			from: "CGK",
			to: "DEL",
			date: "2023-10-10",
			depature_time: "12:00",
			arrival_time: "14:30",
			flightID: "F0005",
		},
	]);

	function handleDelay(e) {
		e.preventDefault();

		if (flightID === null || reason === null || delayMinutes === null) {
			SetStatus("Please fill all the fields");
			return;
		}
		backend("/update-flight-delay", {
			body: {
				flightId: flightID,
				reason,
				delayInMinutes: delayMinutes,
			},
		}).then((data) => {
			if (data == "done") {
				SetStatus("Delay Updated");
			} else {
				SetStatus("Delay Updated");
			}
		});
		// const flightExists = flights.some((flight) => flight.flightID === flightID);
		// if (flightExists) {
		// 	// Check if delayMinutes is a valid integer
		// 	const delayMinutesInt = parseInt(delayMinutes, 10);
		// 	if (!isNaN(delayMinutesInt)) {
		// 		console.log(flightID, reason, delayMinutes);
		// 		SetStatus("Delay Updated");

		// 		//post record to the database
		// 	} else {
		// 		SetStatus("Error! Delay Minutes must be an integer.");
		// 	}
		// } else {
		// 	SetStatus("Flight not found in the database");
		// }
	}

	return (
		<div className="DelayManageSection">
			<h1 className="delayHeader">Flight Delay Manage</h1>
			<div className="FlightDetails">
				<form className="DelayForm">
					<div className="FlightButton">
						<label>Enter the Flight ID</label>
						<input
							type="text"
							value={flightID}
							placeholder="Flight ID"
							required
							onChange={(e) => setFlightID(e.target.value)}
						/>
						<label> Reason for the Delay</label>
						<textarea
							name="delayReason"
							id=""
							cols="30"
							rows="10"
							value={reason}
							onChange={(e) => SetReason(e.target.value)}
							required
						></textarea>
						<label>Delay Minutes</label>
						<input
							type="text"
							value={delayMinutes}
							placeholder="Delay Minutes"
							required
							onChange={(e) => SetDelayMinutes(e.target.value)}
						/>
					</div>
					<button
						className="DelayUpdate"
						onClick={(e) => {
							handleDelay(e);
						}}
					>
						Save the changes
					</button>
				</form>
				<div className="DelayStatus">
					<p>{status}</p>
				</div>
			</div>
		</div>
	);
};

export default DelayManage;
