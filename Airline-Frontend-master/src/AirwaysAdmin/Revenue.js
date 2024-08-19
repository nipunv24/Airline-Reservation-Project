import React, { useEffect, useState } from "react";
import "./Revenue.css";
import { backend } from "../utilities";

const Revenue = () => {
	const [revenue, setRevenue] = useState([]);
	useEffect(() => {
		backend("/aircraft-revenue").then((data) => {
			if (typeof data == "string") {
				console.error(data);
				return;
			}
			setRevenue(data);
		});
	}, []);
	return (
		<div className="RevenueContainer">
			<div className="RevenueDiv">
				<h1 className="RevenueHeader">Aircraft Revenue</h1>
				<table className="RevenueTable">
					<thead className="RevenueThead">
						<tr>
							<th>Aircraft ID</th>
							<th>Model</th>
							<th>Revenue (USD)</th>
						</tr>
					</thead>
					<tbody className="RevenueTbody">
						{revenue.map((revenue) => (
							<tr key={revenue.aircraft_id}>
								<td>{revenue.aircraft_id}</td>
								<td>{revenue.model}</td>
								<td>{revenue.revenue}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Revenue;
