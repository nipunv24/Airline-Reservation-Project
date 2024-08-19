import React, { useState } from "react";
import "./RouteSearch.css";
import { backend } from "../utilities";

const RouteSearch = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [filteredFlights, setFilteredFlights] = useState(null);

  const [flights] = useState([
    {
      model: "Airbus A380",
      from: "BIA",
      to: "BKK",
      date: "2023-10-07",
      departure_time: "08:00",
      arrival_time: "10:30",
      passenger_count: 124,
    },
    {
      model: "Boeing 757-200",
      from: "CGK",
      to: "BKK",
      date: "2023-10-08",
      departure_time: "10:00",
      arrival_time: "12:30",
      passenger_count: 200,
    },
    {
      model: "Boeing 757-200",
      from: "BKK",
      to: "DEL",
      date: "2023-10-10",
      departure_time: "08:00",
      arrival_time: "10:30",
      passenger_count: 184,
    },
    {
      model: "Boeing 737-150",
      from: "DEL",
      to: "SIN",
      date: "2023-10-07",
      departure_time: "08:00",
      arrival_time: "10:30",
      passenger_count: 200,
    },
    {
      model: "Boeing 737-150",
      from: "BIA",
      to: "BKK",
      date: "2023-10-06",
      departure_time: "08:00",
      arrival_time: "10:30",
      passenger_count: 200,
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

  // Function to handle the search button click
  const destinationAirports = airports.filter(
    (airport) => airport.code !== origin
  );

  // Function to handle the search button click
  const handleSearch = () => {
    if (origin && destination) {
      backend("/route-search", {
        body: {
          from: origin,
          to: destination,
        },
      }).then((data) => {
        if (typeof data == "string") {
          console.error(data);
          return;
        }
        console.log(data);
        setFilteredFlights(data);
      });
      // const filteredData = flights.filter((flight) => {
      //   return flight.from === origin && flight.to === destination;
      // });
      // setFilteredFlights(filteredData);
    } else {
      setFilteredFlights(null); // Clear filtered data if origin and destination are not selected
    }
  };

  return (
    <div className="RouteSearchContainer">
      <div className="RouteSearchDiv">
        <h1 className="RouteSearchHeader">Search By Origin and Destination</h1>
        <div className="RouteSearchInputs">
          <form className="RouteSearchForm">
            <label>Origin Airport</label>
            <select
              className="OriginAirportSelect"
              onChange={(e) => setOrigin(e.target.value)}
              value={origin}
            >
              <option value="">Select the Origin Airport</option>
              {airports.map((airport) => (
                <option value={airport.code} key={airport.code}>
                  {airport.name}
                </option>
              ))}
            </select>
            <label>Destination Airport</label>
            <select
              className="DestinationAirportSelect"
              onChange={(e) => setDestination(e.target.value)}
              value={destination}
            >
              <option value="">Select the Destination Airport</option>
              {destinationAirports.map((airport) => (
                <option value={airport.code} key={airport.code}>
                  {airport.name}
                </option>
              ))}
            </select>
            <button
              className="RouteSearchButton"
              onClick={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              Search
            </button>
          </form>
        </div>

        {filteredFlights == null ? null : filteredFlights.length == 0 ? (
          "No such flights are found"
        ) : (
          <div className="FlightTableContainer">
            <h2 className="FlightTableHeader">Flight Details:</h2>
            <table className="FlightTable">
              <thead>
                <tr>
                  <th>Flight ID</th>
                  <th>Scheduled Date</th>
                  <th>Departure Time</th>
                  <th>Arrival Time</th>
                  <th>Passenger Count</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlights.map((flight, index) => (
                  <tr key={index}>
                    <td>{flight.model}</td>
                    <td>{flight.date}</td>
                    <td>{flight.departure_time}</td>
                    <td>{flight.arrival_time}</td>
                    <td>{flight.passenger_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteSearch;
