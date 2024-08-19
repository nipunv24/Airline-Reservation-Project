import "./App.css";
import Homepage from "./Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Logincustadmin from "./LoginPage/Logincustadmin";
import Register from "./CustomerAndGuest/Register";
import Logingguest from "./LoginPage/Logingguest";
import Flight from "./CustomerAndGuest/Flight";
import Booking from "./CustomerAndGuest/Booking";
import Payment from "./CustomerAndGuest/Payment";
import Manage from "./AirwaysAdmin/Manage";
import Thanking from "./CustomerAndGuest/Thanking";
import DelayManage from "./AirwaysAdmin/DelayManage";
import SearchByFlight from "./AirwaysAdmin/SearchByFlight";
import SearchByDate from "./AirwaysAdmin/SearchByDate";
import SearchBookings from "./AirwaysAdmin/SearchBookings";
import RouteSearch from "./AirwaysAdmin/RouteSearch";
import Revenue from "./AirwaysAdmin/Revenue";
import PaymentStatus from "./CustomerAndGuest/PaymentStatus";
import AboutUs from "./AboutUs";
import "./App.css";

import { useState } from "react";

function App() {
  const [email, setEmail] = useState("check");
  const [flightID, setFlightID] = useState();
  const [count, setCount] = useState(0);
  const [passengers, setPassengers] = useState([]);
  const [tickets, setTickets] = useState([]);

  return (
		<div className="App">
			<Router>
				<Routes>
					<Route exact path="/" element={<Homepage setEmail={setEmail} />} />
					<Route
						path="/Logincustadmin"
						element={<Logincustadmin email={email} setEmail={setEmail} />}
					/>
					<Route path="/Register" element={<Register />} />
					<Route path="/Logingguest" element={<Logingguest />} />
					<Route
						path="/Flight"
						element={
							<Flight
								email={email}
								setEmail={setEmail}
								setFlightID={setFlightID}
							/>
						}
					/>
					<Route
						path="/Booking"
						element={
							<Booking
								email={email}
								setEmail={setEmail}
								passengers={passengers}
								setPassengers={setPassengers}
								count={count}
								setCount={setCount}
								flightID={flightID}
							/>
						}
					/>
					<Route
						path="/Payment"
						element={
							<Payment
								passengers={passengers}
								flightID={flightID}
								count={count}
								email={email}
								setTickets={setTickets}
							/>
						}
					/>
					<Route path="/Manage" element={<Manage email={email} />} />
					<Route path="/DelayManage" element={<DelayManage />} />
					<Route path="/SearchByFlight" element={<SearchByFlight />} />
					<Route path="/SearchByDate" element={<SearchByDate />} />
					<Route path="/SearchBookings" element={<SearchBookings />} />
					<Route path="/RouteSearch" element={<RouteSearch />} />
					<Route path="/Revenue" element={<Revenue />} />
					<Route
						path="/PaymentStatus"
						element={<PaymentStatus tickets={tickets} />}
					/>
					<Route path="/Thanking" element={<Thanking />} />
					<Route path="/AboutUs" element={<AboutUs />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
