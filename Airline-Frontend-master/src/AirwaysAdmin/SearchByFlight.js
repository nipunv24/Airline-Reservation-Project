import React, { useState } from "react";
import "./SearchByFlight.css";
import { backend } from "../utilities";

const SearchByFlight = () => {
	// const [passengersAbove18, setPassengersAbove18] = useState([
	// 	{
	// 		name: "Virat Kohli",
	// 		passportNumber: "123456789",
	// 		contactNo: "0722263398",
	// 		Date_of_Birth: "1994-10-07",
	// 		flightID: "F0001",
	// 	},
	// 	{
	// 		name: "Kusal Mendis",
	// 		passportNumber: "123458756",
	// 		contactNo: "0712268398",
	// 		Date_of_Birth: "1998-10-07",
	// 		flightID: "F0001",
	// 	},
	// 	{
	// 		name: "Dasun Shanaka",
	// 		passportNumber: "000456789",
	// 		contactNo: "0766668398",
	// 		Date_of_Birth: "1992-10-07",
	// 		flightID: "F0001",
	// 	},
	// ]);

	// const [passengersBelow18, setPassengersBelow18] = useState([
	// 	{
	// 		name: "Ishan Kishan",
	// 		passportNumber: "123563789",
	// 		contactNo: "0722269438",
	// 		Date_of_Birth: "2006-10-07",
	// 		flightID: "F0001",
	// 	},
	// 	{
	// 		name: "Nassem Shah",
	// 		passportNumber: "321458756",
	// 		contactNo: "0718622398",
	// 		Date_of_Birth: "2007-10-07",
	// 		flightID: "F0001",
	// 	},
	// 	{
	// 		name: "Rashid Khan",
	// 		passportNumber: "400056789",
	// 		contactNo: "0765648398",
	// 		Date_of_Birth: "2008-10-07",
	// 		flightID: "F0001",
	// 	},
	// ]);

	const [flightId, setFlightId] = useState("");
	const [ageCategory, setAgeCategory] = useState("above18");
	const [filteredPassengers, setFilteredPassengers] = useState([]);
	const [searched, setSearched] = useState(false); // State to track whether the search button has been clicked

	const handleSearch = () => {
		if (!flightId) return;

		backend("/search-by-flight", {
			body: {
				flightId,
				ageCategory,
			},
		}).then((passengers) => {
			if (typeof passengers == "string") {
				return;
			}
			setSearched(true);

			if (ageCategory == "above18" || ageCategory == "below18") {
				setFilteredPassengers(passengers);
			} else {
				console.error("Unknown value for ageCategory", ageCategory);
			}
		});
		// if (flightId) {
		// 	if (ageCategory === "above18") {
		// 		// Filter passengers above 18
		// 		const above18Passengers = passengersAbove18.filter(
		// 			(passenger) => passenger.flightID === flightId
		// 		);
		// 		setFilteredPassengers(above18Passengers);
		// 	} else if (ageCategory === "below18") {
		// 		// Filter passengers below 18
		// 		const below18Passengers = passengersBelow18.filter(
		// 			(passenger) => passenger.flightID === flightId
		// 		);
		// 		setFilteredPassengers(below18Passengers);
		// 	}
		// }

		// // Set searched to true when the search button is clicked
		// setSearched(true);
	};

	return (
		<div className="SearchFlight">
			<h1 className="SearchByFlightHeader">
				<strong>Search By Flight</strong>
			</h1>
			<form className="SearchFlightForm">
				<label htmlFor="flightId">Enter Flight ID:</label>
				<input
					type="text"
					id="flightId"
					value={flightId}
					onChange={(e) => setFlightId(e.target.value)}
					required
				/>

				<label>Age Category:</label>
				<select
					value={ageCategory}
					onChange={(e) => setAgeCategory(e.target.value)}
				>
					<option value="above18">Above 18</option>
					<option value="below18">Below 18</option>
				</select>

				<button type="button" onClick={handleSearch}>
					Search
				</button>
			</form>

			{searched && filteredPassengers.length > 0 ? (
				<div className="SearchFlightTableDetails">
					<h2 className="SearchFlightHeader">Passengers Details :</h2>
					<table className="SearchFlightTable">
						<thead>
							<tr>
								<th>Name</th>
								<th>Passport Number</th>
								<th>Contact No</th>
								<th>Date of Birth</th>
							</tr>
						</thead>
						<tbody>
							{filteredPassengers.map((passenger) => (
								<tr key={passenger.passportNumber}>
									<td>{passenger.name}</td>
									<td>{passenger.passportNumber}</td>
									<td>{passenger.contactNo}</td>
									<td>{passenger.Date_of_Birth}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : searched ? (
				<p>No passengers found for the given criteria.</p>
			) : null}
		</div>
	);
};

export default SearchByFlight;
