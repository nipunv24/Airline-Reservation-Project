import React, { useState } from "react";
import { backend } from "../utilities";
import "./SearchBookings.css";

const SearchBookings = () => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [filteredBookings, setFilteredBookings] = useState([]);
	const [bookingCountByClass, setBookingCountByClass] = useState(null);
	const [BookingDetails] = useState([
		{
			traveler_class: "Economy",
			booking_count: 124,
			booking_date: "2023-10-05",
		},
		{
			traveler_class: "Business",
			booking_count: 46,
			booking_date: "2023-10-08",
		},
		{
			traveler_class: "Platinum",
			booking_count: 12,
			booking_date: "2023-10-15",
		},
		{
			traveler_class: "Economy",
			booking_count: 76,
			booking_date: "2023-10-08",
		},
		{
			traveler_class: "Business",
			booking_count: 26,
			booking_date: "2023-10-08",
		},
		{
			traveler_class: "Platinum",
			booking_count: 2,
			booking_date: "2023-10-09",
		},
	]);

	// Function to handle search and filter bookings based on the date range
	const handleSearchBookings = (e) => {
		e.preventDefault();

		if (startDate && endDate) {
			backend("/search-bookings", {
				body: {
					startDate,
					endDate,
				},
			}).then((data) => {
				if (typeof data == "string") {
					console.error(data);
					return;
				}
				console.log(data);
				setBookingCountByClass(data);
			});
		}
		// 	const filteredData = BookingDetails.filter((booking) => {
		// 		return (
		// 			booking.booking_date >= startDate && booking.booking_date <= endDate
		// 		);
		// 	});
		// 	setFilteredBookings(filteredData);
		// } else {
		// 	setFilteredBookings([]); // Clear filtered data if date range is not selected
		// }
	};

	return (
		<div className="SearchBookingContainer">
			<div className="SearchBooking">
				<h1 className="SearchBookingHeader">Search Bookings</h1>
				<div className="DateRangeFormDiv">
					<form className="DateRangeForm">
						<div className="BookingStartDate">
							<label>Start Date</label>
							<input
								type="date"
								required
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</div>
						<div className="BookingEndDate">
							<label>End Date</label>
							<input
								type="date"
								required
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
						<button
							className="BookingCountButton"
							onClick={(e) => {
								handleSearchBookings(e);
							}}
						>
							Search
						</button>
					</form>
				</div>
			</div>

			{bookingCountByClass == null ? null : (
				<div className="BookingTableContainer">
					<h2 className="BookingTableHeader">Booking Details:</h2>
					<table className="BookingTable">
						<thead>
							<tr>
								<th>Traveler Class</th>
								<th>Booking Count</th>
							</tr>
						</thead>
						<tbody>
							{bookingCountByClass == null
								? null
								: Object.entries(bookingCountByClass).map(([key, value]) => {
										console.log(key, value);
										const travelerClass = key.replace("_passenger_count", "");

										return (
											<tr key={travelerClass}>
												<td>{travelerClass}</td>
												<td>{value}</td>
											</tr>
										);
								  })}
							{/* {filteredBookings
								.reduce((acc, booking) => {
									const existingBooking = acc.find(
										(item) => item.traveler_class === booking.traveler_class
									);

									if (existingBooking) {
										existingBooking.booking_count += booking.booking_count;
									} else {
										acc.push({
											traveler_class: booking.traveler_class,
											booking_count: booking.booking_count,
										});
									}

									return acc;
								}, [])
								.map((booking, index) => (
									<tr key={index}>
										<td>{booking.traveler_class}</td>
										<td>{booking.booking_count}</td>
									</tr>
								))} */}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default SearchBookings;
