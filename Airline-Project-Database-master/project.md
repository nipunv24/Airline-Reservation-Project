### Login page (Logincustadmin.js)

we have to check whether the entered email and password are registered or not.
To check that we have to get the necessary data from the user and admin tables.
We need only the emails and passwords from those table.

We can use sample sql queries like this:-

```sql
SELECT Email_address, Password
from User; SELECT Email_address,Password from Admin;
```

From this page we send the email of the user to the flight.js page. (We can keep
track on the user using this email variable)

### Managing Delayed Flights (DelayManage.js)

Here we need to check whether the entered flight id is in the database or not.
For that we need the Flight_ID from Flight schedule table.

Sample sql query :-

```sql
SELECT Flight_ID from `Flight schedule`;
```

Also here we need to send the entered details about a delayed flight into the
database. There, we have to store those details in the `FlightDelaysEntity`. In
that table you can see there are six attributes

- DelayID
- Flight_ID
- Delay_reason
- Delay_minutes
- Notification_sent
- Notification_time

But in the front end we care taking only 3 of them (Flight_ID, Delay_reason,
Dealy_minutes). So when we send the data to the database we have to send the
other three also. (Specially the Delay_ID because it is the primary key in the
`FlightDelaysEntity` table). In order to generate the Delay_ID,

```js
function generateDelayID() {
	return `D-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

### Flights (Flight.js)

Here we need to get the necessary details using the `Flight Schedule` and route
tables. From them we should get the origin airport, desination airport,
scheduled date, arrival time, departure time. Also we need the Flight_ID (We can
send this Flight_ID to the Booking.js for other uses)

Sample sql query :-

```sql
SELECT
  r.Origin_airport,
  r.Destination_airport,
  f.Schedule_date,
  f.Arrival_time,
  f.Departure_time,
  f.Flight_ID
FROM `Flight Schedule` AS f
INNER JOIN `Route` AS r
USING(Route_ID);
```

We have to keep airports array in the flight.js page hard coded to get the names
of the airports ( example :- we can not display the name "Bandaranaike
International Airport, Sri Lanka (BIA)" without hard coding it ) From this page
we send the Flight_ID and the email (which we sent in the login page) to the
Booking.js

### Booking page (Booking.js)

Here we use the Flight_ID which we sent from the flight.js to get the necessary
data for the Booking page. To get the necessary data we have to combine three
tables (Flight schedule, Aircraft, Aircraft_models). Using those three tables we
can get the details about flight_id, aircraft_id, economy,business,platinum seat
count using this sample sql query :-

```sql
SELECT
  f.Flight_ID,
  f.Aircraft_ID,
  am.Economy_seat_count,
  am.Business_seat_count,
  am.Platinum_seat_count
FROM `flight schedule` AS f
INNER JOIN aircraft AS a
USING(Aircraft_ID)
INNER JOIN `aircraft_models` AS am
USING(Model_ID);
```

With these details and the flight id which we sent from the flight.js page we
can do the tasks in the Booking.js (such as displaying the aircraft id on the
top of the page, get the seat numbers for the drop down lists). We also need the
details in the "Seat selection" table to check whether the selected seat number
by the user is already booked or not. Sample sql query :-

```sql
SELECT \* FROM `Seat selection`;
```

In this page we keep the records about the passenger details (which we enter in
the input fields), the passenger count,flight id and email (which we sent from
the flight.js page)

### Payment page (Payment.js)

Here the details from the user table. Sample sql query :-

```sql
SELECT \* FROM User;
```

Here we get the corresponding user details using the email which we sent from
the booking.js page. Also we need the flight details. We can use the three
tables mentioned in the booking.js (Flight schedule,Aircraft, Aircraft
models).  
 We can use the same sql query :- 
 
```sql
SELECT f.Flight_ID, f.Aircraft_ID, am.Economy_seat_count,
am.Business_seat_count, am.Platinum_seat_count FROM `flight schedule` AS f INNER
JOIN aircraft AS a USING(Aircraft_ID) INNER JOIN `aircraft_models` AS am USING(Model_ID);
```
Also we need to display the total calculated price. (I think Chethmi created a function
or a procedure in the workbench to calculate the total price). We need get it from
the database.

If someone enters the site as a guest then before the payment he or she can some input fields (This is only visible for the guests). After filling those fields and clicking the submit button we check whether the this person previously booked a flight or not.

If he is a new guest then we save his details in the guestInfo array (in the front end)
(A guest can book a fight only once. If he tries to book once again he must create an account)

With the submit button getting clicked we need to send those data into the user table in the database. (Some fields in the user table can be null for the guests)

After we enter the details (email, card number :- 4242 4242 4242 4242), date/month and CVC) in the pop up window of the payment section then click pay button, five tables should be updated.

Ticket, Payment, Passenger, Booking and Seat selection

### Payment Status (PaymentStatus.js)
In this page we need to show the details in
the ticket table combining with the passenger table for the corresponding
passengers. (This page is not essential. The thing we want to show here is the
details about the payment of the relavent passengers)

### Register page (Register.js)
In this page we need to send the filled details
into the database (to the user table) when we clicked the "Create Account"
button
