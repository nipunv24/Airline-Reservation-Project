import './SearchByDate.css'; // Import your CSS file

import React, { useState } from 'react';

import { backend } from '../utilities';

const SearchByDate = () => {
	const [destination, setDestination] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [filteredPassengers, setFilteredPassengers] = useState([]);
	const [passengerCount, setPassengerCount] = useState(0);

	const [flightDetails] = useState([
		{
			name: "Ishan Kishan",
			passportNumber: "123563789",
			contactNo: "0722269438",
			Destination_airport: "CGK",
			Schedule_date: "2023-10-07",
		},
		{
			name: "Nassem Shah",
			passportNumber: "321458756",
			contactNo: "0718622398",
			Destination_airport: "DEL",
			Schedule_date: "2023-10-08",
		},
		{
			name: "Rashid Khan",
			passportNumber: "400056789",
			contactNo: "0765648398",
			Destination_airport: "BIA",
			Schedule_date: "2023-10-09",
		},
		{
			name: "Shadab Khan",
			passportNumber: "403056789",
			contactNo: "0765678398",
			Destination_airport: "BIA",
			Schedule_date: "2023-10-07",
		},
	]);

	const airports = [
		{
			code: "BIA",
			name: "Bandaranaike International Airport, Sri Lanka (BIA)",
		},
		{ code: "BKK", name: "Suvarnabhumi International Airport, Thailand (BKK)" },
		{
			code: "BOM",
			name: "Chhatrapati Shivaji Maharaj International Airport, India (BOM)",
		},
		{
			code: "CGK",
			name: "Soekarno-Hatta International Airport, Indonesia (CGK)",
		},
		{ code: "DEL", name: "Indira Gandhi International Airport, India (DEL)" },
		{ code: "DMK", name: "Don Mueang International Airport, Thailand (DMK)" },
		{
			code: "DPS",
			name: "I Gusti Ngurah Rai International Airport, Indonesia (DPS)",
		},
		{
			code: "HRI",
			name: "Mattala Rajapaksa International Airport, Sri Lanka (HRI)",
		},
		{ code: "MAA", name: "Chennai International Airport, India (MAA)" },
		{ code: "SIN", name: "Singapore Changi Airport, Singapore (SIN)" },
	];

	function handleSearchFlightButton(e) {
		e.preventDefault();
		backend("/search-by-date", {
			body: {
				destination,
				startDate,
				endDate,
			},
		}).then((Passengers) => {
			if (typeof Passengers == "string") {
				console.error(filteredPassengers);
				return;
			}
			setFilteredPassengers(Passengers);
			setPassengerCount(Passengers.length);
		});

		// Filter flight details based on destination, start date, and end date
		// const filteredFlights = flightDetails.filter((flight) => {
		//   return (
		//     flight.Destination_airport === destination &&
		//     flight.Schedule_date >= startDate &&
		//     flight.Schedule_date <= endDate
		//   );
		// });

		// setFilteredPassengers(filteredFlights);

		// Calculate and set the passenger count
		// setPassengerCount(filteredFlights.length);
	}

	return (
		<div className="SearchDateContainer">
			<div className="SearchDate">
				<h1 className="SearchDateHeader">Search Passenger by Destination</h1>
				<form className="SearchDateForm">
					<label>Destination Airport</label>
					<select
						className="DestinationAirportSelect"
						onChange={(e) => setDestination(e.target.value)}
						value={destination}
					>
						<option value="">Select the Destination Airport</option>
						{airports.map((airport) => (
							<option value={airport.code} key={airport.code}>
								{airport.name}
							</option>
						))}
					</select>
					<div className="StartDateForm">
						<label>Start Date</label>
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</div>
					<div className="EndDateForm">
						<label>End Date</label>
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
						/>
					</div>
					<button
						className="SearchDateButton"
						onClick={(e) => {
							handleSearchFlightButton(e);
						}}
					>
						Search
					</button>
				</form>
			</div>

			{filteredPassengers.length > 0 ? (
				<div className="PassengerTableContainer">
					<table className="PassengerTable">
						<thead>
							<tr>
								<th>Name</th>
								<th>Passport Number</th>
								<th>Contact No</th>
								<th>Destination Airport</th>
								<th>Scheduled Date</th>
							</tr>
						</thead>
						<tbody>
							{filteredPassengers.map((passenger) => (
								<tr key={passenger.passportNumber}>
									<td>{passenger.name}</td>
									<td>{passenger.passportNumber}</td>
									<td>{passenger.contactNo}</td>
									<td>{passenger.Destination_airport}</td>
									<td>{passenger.Schedule_date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : null}

			{passengerCount > 0 ? (
				<div className="PassengerCountContainer">
					<h3>
						<strong>Total Passengers: {passengerCount}</strong>
					</h3>
				</div>
			) : (
				<div className="PassengerCountContainer">
					<h3>
						<strong>Total Passengers: {passengerCount}</strong>
					</h3>
				</div>
			)}
		</div>
	);
};

export default SearchByDate;
