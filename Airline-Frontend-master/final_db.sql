/*----------------------DATABASE CREATION------------------------*/

DROP database B_airways;
CREATE database B_airways;
USE B_airways;

/*--------------------DATA TABLE CREATION-----------------------*/
CREATE TABLE Aircraft_Models (
   Model_ID  int,
   Model  varchar(50),
   Economy_seat_count int,
   Business_seat_count int,
   Platinum_seat_count int,
   PRIMARY KEY (Model_ID)
);


CREATE TABLE `Aircraft` (
  `Aircraft_ID` varchar(50),
  `Model_ID` int,
  PRIMARY KEY (`Aircraft_ID`),
  FOREIGN KEY(Model_ID) REFERENCES Aircraft_Models(Model_ID)
);


CREATE TABLE `Ticket Prices` (
  `Traveler_class` varchar(50),
  `Precentage` decimal(2,1),
  PRIMARY KEY (`Traveler_class`)
);

CREATE TABLE Admin(
   Admin_ID varchar(5),
   Name varchar(50),
   Email_address varchar(50),
   Password varchar(60),
   PRIMARY KEY(Admin_ID)
);

CREATE TABLE `Payment` (
  `Payment_ID` varchar(50),
  `Price` decimal(10,2) CHECK (`Price`>0),
  `Transaction_status` varchar(50) CHECK (`Transaction_status` IN ('Success','Failed')),
  PRIMARY KEY (`Payment_ID`)
);

CREATE TABLE `Membership` (
  `Membership_type` varchar(50)  CHECK (`Membership_type` IN ('Frequent','Gold','Guest')),
  `Discount_percentage` int CHECK (`Discount_percentage` IN (5,9,0)),
  PRIMARY KEY (`Membership_type`)
);

CREATE TABLE `Passenger` (
  `Passport_No` varchar(50),
  `Name` varchar(50),
  `DOB` date,
  `Gender` varchar(50) CHECK (`Gender` IN ('Male','Female')),
  `Contact_No` varchar(50),
  PRIMARY KEY (`Passport_No`)
);

CREATE TABLE `Address` (
  `Address_ID` varchar(50),
  `Name` varchar(50),
  `Parent_ID` varchar(50),
  `Level_Number` varchar(50),
  PRIMARY KEY (`Address_ID`),
  FOREIGN KEY (`Parent_ID`) REFERENCES `Address`(`Address_ID`)
);

CREATE TABLE `Airport` (
  `Airport_code` varchar(50),
  `Address_ID` varchar(50),
  PRIMARY KEY (`Airport_code`),
  FOREIGN KEY (`Address_ID`) REFERENCES `Address`(`Address_ID`)
);


CREATE TABLE `Route` (
  `Route_ID` varchar(50),
  `Origin_airport` varchar(50),
  `Destination_airport` varchar(50),
   Base_Price int,
  PRIMARY KEY (`Route_ID`),
  FOREIGN KEY (`Destination_airport`) REFERENCES `Airport`(`Airport_code`)
);


CREATE TABLE `Flight Schedule` (
  `Flight_ID` varchar(50),
  `Route_ID` varchar(50),
  `Aircraft_ID` varchar(50),
  `Schedule_date` date,
  `Departure_time` time,
  `Arrival_time` time,
  PRIMARY KEY (`Flight_ID`),
  FOREIGN KEY (`Route_ID`) REFERENCES `Route`(`Route_ID`),
  FOREIGN KEY (`Aircraft_ID`) REFERENCES `Aircraft`(`Aircraft_ID`)
);



CREATE TABLE `Seat Selection` (
  `Seat_Number` int,
  `Flight_ID` varchar(50),
  `Traveler_Class` varchar(50) CHECK (`Traveler_Class` IN ('Economy','Business','Platinum')),
  `Availability` varchar(50) CHECK (`Availability` IN ('Yes','Booked')),
  PRIMARY KEY (`Seat_Number`,`Flight_ID`,`Traveler_Class`),
  FOREIGN KEY (`Flight_ID`) REFERENCES `Flight Schedule`(`Flight_ID`)
);



CREATE TABLE `User` (
  `User_ID` varchar(50),
  `Email_address` varchar(100),
  `Password` varchar(60) NOT NULL,
  `Name` varchar(50),
  `Address` varchar(50),
  `Birthday` date,
  `NIC` varchar(50),
  `Phone_number` varchar(50),
  `Passport_number` varchar(50),
  `Membership_type` varchar(50) CHECK (`Membership_type` IN ('Frequent','Gold','Guest')),
   Travel_Count int,
   Role varchar(50),
  PRIMARY KEY (`User_ID`),
  FOREIGN KEY (`Membership_type`) REFERENCES `Membership`(`Membership_type`)
);


CREATE TABLE `Booking` (
  `Booking_ID` varchar(50),
  `Flight_ID` varchar(50),
  `User_ID` varchar(50),
  `Passenger_count` int CHECK (`Passenger_count`>0),
  `Traveler_class` varchar(50) CHECK (`Traveler_class` IN ('Economy','Business','Platinum')),
  `Payment_ID` varchar(50),
  PRIMARY KEY (`Booking_ID`),
  FOREIGN KEY (`Flight_ID`) REFERENCES `Flight Schedule`(`Flight_ID`),
  FOREIGN KEY (`User_ID`) REFERENCES `User`(`User_ID`),
  FOREIGN KEY (`Traveler_class`) REFERENCES `Ticket Prices`(`Traveler_class`),
  FOREIGN KEY (`Payment_ID`) REFERENCES `Payment`(`Payment_ID`)
);



CREATE TABLE `Ticket` (
  `Ticket_No` varchar(50),
  `Issued_date` date,
  `Gate_No` varchar(50),
  `Seat_No` int,
  `Flight_ID` varchar(50),
  `Traveler_Class` varchar(50),
  `Booking_ID` varchar(50),
  `Passport_No` varchar(50),
  PRIMARY KEY (`Ticket_No`),
  FOREIGN KEY (`Booking_ID`) REFERENCES `Booking`(`Booking_ID`),
  FOREIGN KEY (`Seat_No`,`Flight_ID`,`Traveler_Class`) REFERENCES `Seat Selection`(`Seat_Number`,`Flight_ID`,`Traveler_Class`),
  FOREIGN KEY (`Passport_No`) REFERENCES `Passenger`(`Passport_No`)
);


CREATE TABLE `FlightDelaysEntity` (
  `DelayID` varchar(50),
  `Flight_ID` varchar(50),
  `Delay_reason` varchar(50),
  `Delay_minutes` int,
  `Notification_sent` varchar(50) CHECK (`Notification_sent` IN ('Yes','No')),
  `Notification_time` varchar(50),
  PRIMARY KEY (`DelayID`),
  FOREIGN KEY (`Flight_ID`) REFERENCES `Flight Schedule`(`Flight_ID`)
);


create table AircraftRevenue(
	Aircraft_ID varchar(50),
    Revenue decimal (8,2),
    PRIMARY KEY (Aircraft_ID)
);



/*----------------------------FUNCTIONS, PROCEDURES AND TRIGGERS------------------------*/


/*------------------------------Procedure 01 -------------------------------------------
Given a flight no, all passengers travelling in it (next immediate flight) above age 18*/

-- DROP PROCEDURE GetPassengersAbove18;

DELIMITER $$
CREATE PROCEDURE GetPassengersAbove18(
    IN p_flight_ID varchar(50)
)
BEGIN
    
    -- Passengers above age 18
    SELECT P.Name, T.Passport_No, P.DOB, P.Contact_No
    FROM Passenger P
    JOIN Ticket T ON P.Passport_No = T.Passport_No
    JOIN Booking B ON T.Booking_ID = B.Booking_ID
    JOIN `Flight Schedule` FS ON B.Flight_ID = FS.Flight_ID
    WHERE FS.Flight_ID = p_flight_ID AND TIMESTAMPDIFF(YEAR, P.DOB, CURDATE()) >= 18;
END $$
DELIMITER ;



/*------------------------------Procedure 02 -------------------------------------------
Given a flight no, all passengers travelling in it (next immediate flight) below age 18*/

-- DROP PROCEDURE GetPassengersBelow18;

DELIMITER $$
CREATE PROCEDURE GetPassengersBelow18(
    IN p_flight_ID varchar(50)
)
BEGIN
    
    -- Passengers below age 18
    SELECT P.Name, T.Passport_No, P.DOB, P.Contact_No
    FROM Passenger P
    JOIN Ticket T ON P.Passport_No = T.Passport_No
    JOIN Booking B ON T.Booking_ID = B.Booking_ID
    JOIN `Flight Schedule` FS ON B.Flight_ID = FS.Flight_ID
    WHERE FS.Flight_ID = p_flight_ID AND TIMESTAMPDIFF(YEAR, P.DOB, CURDATE()) < 18;
END $$

DELIMITER ;


    
/*------------------------------Procedure 03 -------------------------------------------
------Given a date range, number of passengers travelling to a given destination--------*/   

-- DROP PROCEDURE GetPassengersByDestination;

DELIMITER $$
CREATE PROCEDURE GetPassengersByDestination(
    IN destination VARCHAR(50),
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT SUM(B.Passenger_count) AS total_count
    FROM Booking B 
    JOIN `Flight Schedule` FS ON FS.Flight_ID = B.Flight_ID
    JOIN Route R ON R.Route_ID = FS.Route_ID
    WHERE R.Destination_airport = destination 
    AND FS.Schedule_date BETWEEN start_date AND end_date;
END$$
DELIMITER ;



/*------------------------------Procedure 04 -------------------------------------------
---------Given a date range, number of bookings by each passenger type----------------*/   

-- DROP PROCEDURE GetPassengersCountByClass;

DELIMITER $$
CREATE PROCEDURE GetPassengersCountByClass(
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT
        SUM(CASE WHEN B.Traveler_class = 'Economy' THEN B.Passenger_count ELSE 0 END) AS Economy_passenger_count,
        SUM(CASE WHEN B.Traveler_class = 'Business' THEN B.Passenger_count ELSE 0 END) AS Business_passenger_count,
        SUM(CASE WHEN B.Traveler_class = 'Platinum' THEN B.Passenger_count ELSE 0 END) AS Platinum_passenger_count
    FROM Booking B
    JOIN `Flight Schedule` FS ON B.Flight_ID = FS.Flight_ID
    WHERE FS.Schedule_date BETWEEN start_date AND end_date;
END$$
DELIMITER ;
 


/*------------------------------Procedure 05 -------------------------------------------
------Given origin and destination, all past flights, states, passenger counts data-----*/
 
-- DROP PROCEDURE GetFlightDetailsByRoute;

DELIMITER $$
CREATE PROCEDURE GetFlightDetailsByRoute(
    IN origin VARCHAR(50),
    IN destination VARCHAR(50)
)
BEGIN
    SELECT
        FS.Flight_ID,
        FS.Schedule_date,
        FS.Departure_time,
        FS.Arrival_time,
        SUM(B.Passenger_count) AS Total_Passenger_count
    FROM `Flight Schedule` FS
    JOIN Route R ON R.Route_ID = FS.Route_ID
    JOIN Booking B ON B.Flight_ID = FS.Flight_ID
    WHERE R.Origin_airport = origin AND R.Destination_airport = destination
    GROUP BY FS.Flight_ID, FS.Schedule_date, FS.Departure_time, FS.Arrival_time;
END$$
DELIMITER ;


/*------------------------------Procedure 06 -------------------------------------------
--------------------Updating passenger table once a booking is done--------------------*/

-- DROP PROCEDURE InsertPassengerDetails;

DELIMITER $$
CREATE PROCEDURE InsertPassengerDetails(
    Passport_No VARCHAR(50),
    Name VARCHAR(50),
    DOB Date,
    Gender VARCHAR(50),
    Contact_No VARCHAR(50)
)
BEGIN
    INSERT INTO Passenger VALUES(Passport_No,Name,DOB,Gender,Contact_No);
END$$

DELIMITER ;


/*------------------------------Procedure 07 -------------------------------------------
---------------------Update Payment table once a payment is done----------------------*/

-- DROP PROCEDURE InsertPaymentDetails;

DELIMITER $$
CREATE PROCEDURE InsertPaymentDetails(
    Payment_ID VARCHAR(50),
    Price DECIMAL(10,2),
    Transaction_status VARCHAR(50)
)
BEGIN
    INSERT INTO Payment VALUES(Payment_ID,Price,Transaction_status);
END$$

DELIMITER ;


/*------------------------------Procedure 08 -------------------------------------------
---------------------Update Ticket table once a ticket is booked----------------------*/

-- DROP PROCEDURE InsertTicketDetails;

DELIMITER $$
CREATE PROCEDURE InsertTicketDetails(
    Ticket_No VARCHAR(50),
    Issued_date DATE,
    Gate_No VARCHAR(50),
    Seat_No INT,
    Flight_ID VARCHAR(50),
    Traveler_Class VARCHAR(50),
    Booking_ID VARCHAR(50),
    Passport_No VARCHAR(50)
)
BEGIN
    INSERT INTO Ticket VALUES(Ticket_No,Issued_date,Gate_No,Seat_No,Flight_ID,Traveler_Class,Booking_ID,Passport_No);
END$$

DELIMITER ;


/*------------------------------Procedure 09 -------------------------------------------
--------------------Update Booking table once a new booking is done--------------------*/

-- DROP PROCEDURE InsertBookingDetails;

DELIMITER $$
CREATE PROCEDURE InsertBookingDetails(
    Booking_ID VARCHAR(50),
    Flight_ID VARCHAR(50),
    User_ID VARCHAR(50),
    Passenger_count INT,
    Traveler_class VARCHAR(50),
    Payment_ID VARCHAR(50)
)
BEGIN
    INSERT INTO Booking VALUES(Booking_ID,Flight_ID,User_ID,Passenger_count,Traveler_class,Payment_ID);
END$$

DELIMITER ;


/*------------------------------Procedure 10 -------------------------------------------
-----------------Update the seat_selection table with each seat booking----------------*/

DROP PROCEDURE InsertSeatSelectionDetails;

DELIMITER $$
CREATE PROCEDURE InsertSeatSelectionDetails(
	Seat_Number VARCHAR(50),
    Flight_ID VARCHAR(50),
    Traveler_class VARCHAR(50),
    Availability VARCHAR(50)
)
BEGIN
	INSERT INTO `seat selection` VALUES(Seat_Number,Flight_ID,Traveler_class,Availability);
END$$
DELIMITER ;


/*------------------------------Procedure 11 -------------------------------------------
-----Get the booked seat numbers when the flight ID and the traveler class is given----*/

-- DROP PROCEDURE GetBookedSeatNumbers;
DELIMITER $$
CREATE PROCEDURE GetBookedSeatNumbers(
    IN Flight_ID varchar(50),
    IN Class varchar(50)
)
BEGIN
    SELECT Seat_Number
    FROM `seat selection` s
    JOIN  `flight schedule` FS ON s.Flight_ID = FS.Flight_ID
    WHERE Traveler_class = Class and FS.Flight_ID = Flight_ID;
END$$
DELIMITER ;



/*------------------------------Trigger 01 -------------------------------------------
-----------------Updating the aircraft revenue upon a new booking--------------------*/
-- DROP TRIGGER update_aircraft_revenue;
DELIMITER //

CREATE TRIGGER update_aircraft_revenue
AFTER INSERT ON Booking
FOR EACH ROW
BEGIN
    -- ## This line is not needed --> DECLARE aircraft_price DECIMAL(10, 2);


    -- Get the aircraft_id for the given Flight_ID
    SELECT Aircraft_ID INTO @aircraft_id
    FROM `Flight Schedule`
    WHERE Flight_ID = NEW.Flight_ID;

    -- Get the price for the given Payment_ID
    SELECT Price INTO @price
    FROM Payment
    WHERE Payment_ID = NEW.Payment_ID;

    
    -- Update the aircraftrevenue table
    UPDATE AircraftRevenue
    SET Revenue = Revenue + @price
    WHERE Aircraft_ID = @aircraft_id;

    -- If the aircraft_id doesn't exist in the aircraft_revenue table, insert a new row
    IF ROW_COUNT() = 0 THEN
        INSERT INTO AircraftRevenue (Aircraft_ID, Revenue)
        VALUES (@aircraft_id, @price);
    END IF;
END;
//

DELIMITER ;



/*------------------------------Trigger 02 -------------------------------------------
----Updating the travel_count and modifying the membership type upon each booking----*/
DROP TRIGGER update_usermembership_travelCount;

DELIMITER //
CREATE TRIGGER update_usermembership_travelCount
AFTER INSERT ON Booking
FOR EACH ROW
BEGIN
    DECLARE user_travel_count INT;

    SELECT User_ID INTO @user_id
    FROM User
    WHERE User_ID = NEW.User_ID;

    SELECT Travel_Count INTO user_travel_count
    FROM User
    WHERE User_ID = NEW.User_ID;

    UPDATE User
    SET Travel_Count = Travel_Count + 1
    WHERE User_ID = @user_id;

    -- The updating process if the travel count becomes greater than 9.
    IF user_travel_count + 1 > 9 THEN
        UPDATE User
        SET Membership_type = "Gold"
        WHERE User_ID = @user_id;
    END IF;
END;
//
DELIMITER ;

/*------------------------------Trigger 03 -------------------------------------------
---------Updating the flight schedule when the flight delay entry is updated---------*/
DROP TRIGGER update_flight_schedule;

DELIMITER //
CREATE TRIGGER update_flight_schedule
AFTER INSERT ON FlightDelaysEntity
FOR EACH ROW
BEGIN
    UPDATE `Flight Schedule`
    SET
        Arrival_time = ADDTIME(Arrival_time, SEC_TO_TIME(NEW.Delay_minutes * 60)),
        Departure_time = ADDTIME(Departure_time, SEC_TO_TIME(NEW.Delay_minutes * 60))
    WHERE Flight_ID = NEW.Flight_ID;
END;
//
DELIMITER ;


/*---------------------INSERTING DATA TO TABLES-------------------------*/

INSERT INTO Aircraft_Models VALUES (1,'Airbus A380',420,95,10);
INSERT INTO Aircraft_Models VALUES (2,'Boeing 737-100',100,21,5);
INSERT INTO Aircraft_Models VALUES (3,'Boeing 737-150',130,27,5);
INSERT INTO Aircraft_Models VALUES (4,'Boeing 757-200',170,22,8);
INSERT INTO Aircraft_Models VALUES (5,'Boeing 757-300',190,41,12);


INSERT INTO Aircraft VALUES ('A380-001',1);
INSERT INTO Aircraft VALUES ('B737-001',2);
INSERT INTO Aircraft VALUES ('B737-002',3);
INSERT INTO Aircraft VALUES ('B737-003',3);
INSERT INTO Aircraft VALUES ('B757-001',4);
INSERT INTO Aircraft VALUES ('B757-002',4);
INSERT INTO Aircraft VALUES ('B757-003',5);
INSERT INTO Aircraft VALUES ('B757-004',5);



INSERT INTO `Ticket Prices` VALUES ('Economy',0.5);
INSERT INTO `Ticket Prices` VALUES ('Business',1.5);
INSERT INTO `Ticket Prices` VALUES ('Platinum',2);


INSERT INTO Admin VALUES ('A01','Jone Kane','johnKane@gmail.com','$2b$12$G4pEjotivumQj46qTYmYVu26uCIPBG8At8SHgGdepEi5c7wg9HkW.');
INSERT INTO Admin VALUES ('A02','William Andrew','wAndrew@gmail.com','$2b$12$n1cXYMCeenlTpcQozIy5q.nta7nKBshTO8MOvkcMKop4OAwnmYhXO');
INSERT INTO Admin VALUES ('A03','Peter Russell','peterR@gmail.com','$2b$12$6e2/ZlPv.hLC5eJO45qiuOhp2ydykL.fXDx7Vyf.j7/30MJymIyqe');
INSERT INTO Admin VALUES ('A04','Tim Lee','timLee@gmail.com','$2b$12$EzOkNX2pFpt/h5oJbbdThueltpzDtaY4p2dxB9axY2aEiCB8xNPIe');
INSERT INTO Admin VALUES ('A05','Brian Smith','briansmith@gmail.com','$2b$12$Ly8N.Fwk4So7Ifwa2nNdMe62PEjUI.qtWdrXs9Q13wVDWAmoD2FD.');



INSERT INTO Membership VALUES ('Frequent',5);
INSERT INTO Membership VALUES ('Gold',9);



INSERT INTO Address VALUES (1,'India',null,0);
INSERT INTO Address VALUES (2,'Indonesia',null,0);
INSERT INTO Address VALUES (3,'Thailand',null,0);
INSERT INTO Address VALUES (4,'Singapore',null,0);
INSERT INTO Address VALUES (5,'Sri Lanka',null,0);
INSERT INTO Address VALUES (6,'Bangkok',3,1);
INSERT INTO Address VALUES (7,'Banten',2,1);
INSERT INTO Address VALUES (8,'Bali',2,1);
INSERT INTO Address VALUES (9,'Delhi',1,1);
INSERT INTO Address VALUES (10,'Maharashtra',1,1);
INSERT INTO Address VALUES (11,'Samut Prakan',3,1);
INSERT INTO Address VALUES (12,'Tamil Nadu',1,1);
INSERT INTO Address VALUES (13,'Bang Phli',11,2);
INSERT INTO Address VALUES (14,'Chennai',12,2);
INSERT INTO Address VALUES (15,'Colombo',5,2);
INSERT INTO Address VALUES (16,'Don Mueang',6,2);
INSERT INTO Address VALUES (17,'Hambantota',5,2);
INSERT INTO Address VALUES (18,'Kabupaten Badung',8,2);
INSERT INTO Address VALUES (19,'Mumbai',10,2);
INSERT INTO Address VALUES (20,'New Delhi',9,2);
INSERT INTO Address VALUES (21,'Singapore',4,2);
INSERT INTO Address VALUES (22,'Tangerang City',7,2);



INSERT INTO Airport VALUES ('BIA',15);
INSERT INTO Airport VALUES ('BKK',13);
INSERT INTO Airport VALUES ('BOM',19);
INSERT INTO Airport VALUES ('CGK',22);
INSERT INTO Airport VALUES ('DEL',20);
INSERT INTO Airport VALUES ('DMK',16);
INSERT INTO Airport VALUES ('DPS',18);
INSERT INTO Airport VALUES ('HRI',17);
INSERT INTO Airport VALUES ('MAA',14);
INSERT INTO Airport VALUES ('SIN',21);



INSERT INTO Route VALUES ('R01','BIA','BKK',800);
INSERT INTO Route VALUES ('R02','BIA','BOM',450);
INSERT INTO Route VALUES ('R03','BIA','CGK',1000);
INSERT INTO Route VALUES ('R04','BIA','DEL',1200);
INSERT INTO Route VALUES ('R05','BIA','HRI',300);
INSERT INTO Route VALUES ('R06','BIA','SIN',550);
INSERT INTO Route VALUES ('R07','BKK','BIA',800);
INSERT INTO Route VALUES ('R08','BKK','BOM',600);
INSERT INTO Route VALUES ('R09','BKK','CGK',1100);
INSERT INTO Route VALUES ('R10','BKK','DEL',850);
INSERT INTO Route VALUES ('R11','BKK','DMK',70);
INSERT INTO Route VALUES ('R12','BKK','SIN',850);
INSERT INTO Route VALUES ('R13','BOM','BIA',800);
INSERT INTO Route VALUES ('R14','BOM','BKK',600);
INSERT INTO Route VALUES ('R15','BOM','CGK',950);
INSERT INTO Route VALUES ('R16','BOM','DEL',100);
INSERT INTO Route VALUES ('R17','BOM','MAA',100);
INSERT INTO Route VALUES ('R18','BOM','SIN',700);
INSERT INTO Route VALUES ('R19','CGK','BIA',1000);
INSERT INTO Route VALUES ('R20','CGK','BKK',1100);
INSERT INTO Route VALUES ('R21','CGK','BOM',950);
INSERT INTO Route VALUES ('R22','CGK','DEL',950);
INSERT INTO Route VALUES ('R23','CGK','DPS',100);
INSERT INTO Route VALUES ('R24','CGK','SIN',650);
INSERT INTO Route VALUES ('R25','DEL','BIA',1200);
INSERT INTO Route VALUES ('R26','DEL','BKK',850);
INSERT INTO Route VALUES ('R27','DEL','BOM',100);
INSERT INTO Route VALUES ('R28','DEL','CGK',950);
INSERT INTO Route VALUES ('R29','DEL','MAA',100);
INSERT INTO Route VALUES ('R30','DEL','SIN',1000);
INSERT INTO Route VALUES ('R31','DMK','BKK',70);
INSERT INTO Route VALUES ('R32','DMK','DPS',1150);
INSERT INTO Route VALUES ('R33','DMK','HRI',750);
INSERT INTO Route VALUES ('R34','DMK','MAA',850);
INSERT INTO Route VALUES ('R35','DPS','CGK',100);
INSERT INTO Route VALUES ('R36','DPS','DMK',1150);
INSERT INTO Route VALUES ('R37','DPS','HRI',700);
INSERT INTO Route VALUES ('R38','DPS','MAA',1800);
INSERT INTO Route VALUES ('R39','HRI','DEL',300);
INSERT INTO Route VALUES ('R40','HRI','DEL',750);
INSERT INTO Route VALUES ('R41','HRI','DEL',700);
INSERT INTO Route VALUES ('R42','HRI','DEL',1800);
INSERT INTO Route VALUES ('R43','MAA','DEL',100);
INSERT INTO Route VALUES ('R44','MAA','DEL',100);
INSERT INTO Route VALUES ('R45','MAA','DEL',850);
INSERT INTO Route VALUES ('R46','MAA','DEL',1800);
INSERT INTO Route VALUES ('R47','MAA','DEL',1800);
INSERT INTO Route VALUES ('R48','SIN','BIA',550);
INSERT INTO Route VALUES ('R49','SIN','BKK',850);
INSERT INTO Route VALUES ('R50','SIN','BOM',700);
INSERT INTO Route VALUES ('R51','SIN','CGK',650);
INSERT INTO Route VALUES ('R52','SIN','DEL',1000);


INSERT INTO `Flight Schedule` VALUES ('BA0001','R08','A380-001','2023-10-01','10:00','12:30');
INSERT INTO `Flight Schedule` VALUES ('BA0002','R14','B737-001','2023-10-01','14:00','16:30');
INSERT INTO `Flight Schedule` VALUES ('BA0003','R21','A380-001','2023-10-01','12:00','14:30');
INSERT INTO `Flight Schedule` VALUES ('BA0004','R10','B757-001','2023-10-01','16:00','18:30');
INSERT INTO `Flight Schedule` VALUES ('BA0005','R30','B737-002','2023-10-01','18:00','20:30');
INSERT INTO `Flight Schedule` VALUES ('BA0006','R34','A380-001','2023-10-02','08:00','10:30');
INSERT INTO `Flight Schedule` VALUES ('BA0007','R29','B757-002','2023-10-02','10:00','12:30');
INSERT INTO `Flight Schedule` VALUES ('BA0008','R11','A380-001','2023-10-02','14:00','16:30');
INSERT INTO `Flight Schedule` VALUES ('BA0009','R15','B757-003','2023-10-02','12:00','14:30');
INSERT INTO `Flight Schedule` VALUES ('BA0010','R24','A380-001','2023-10-02','16:00','18:30');
INSERT INTO `Flight Schedule` VALUES ('BA0011','R39','B737-003','2023-10-02','18:00','20:30');
INSERT INTO `Flight Schedule` VALUES ('BA0012','R06','B737-003','2023-10-03','08:00','10:30');
INSERT INTO `Flight Schedule` VALUES ('BA0013','R32','B757-001','2023-10-03','10:00','12:30');
INSERT INTO `Flight Schedule` VALUES ('BA0014','R02','A380-001','2023-10-03','12:00','14:30');
INSERT INTO `Flight Schedule` VALUES ('BA0015','R22','B757-001','2023-10-03','14:00','16:30');
INSERT INTO `Flight Schedule` VALUES ('BA0016','R28','A380-001','2023-10-03','16:00','18:30');
INSERT INTO `Flight Schedule` VALUES ('BA0017','R36','B737-002','2023-10-03','18:00','20:30');
INSERT INTO `Flight Schedule` VALUES ('BA0018','R13','A380-001','2023-10-04','08:00','10:30');
INSERT INTO `Flight Schedule` VALUES ('BA0019','R20','B757-002','2023-10-04','10:00','12:30');
INSERT INTO `Flight Schedule` VALUES ('BA0020','R35','A380-001','2023-10-04','12:00','14:30');
INSERT INTO `Flight Schedule` VALUES ('BA0021','R37','B757-003','2023-10-04','14:00','16:30');
INSERT INTO `Flight Schedule` VALUES ('BA0022','R40','A380-001','2023-10-04','16:00','18:30');
INSERT INTO `Flight Schedule` VALUES ('BA0023','R03','B737-001','2023-10-04','18:00','20:30');
INSERT INTO `Flight Schedule` VALUES ('BA0024','R31','A380-001','2023-10-05','08:00','10:30');
INSERT INTO `Flight Schedule` VALUES ('BA0025','R05','B757-004','2023-10-05','10:00','12:30');
INSERT INTO `Flight Schedule` VALUES ('BA0026','R01','A380-001','2023-10-05','12:00','14:30');
INSERT INTO `Flight Schedule` VALUES ('BA0027','R09','B757-002','2023-10-05','14:00','16:30');
INSERT INTO `Flight Schedule` VALUES ('BA0028','R16','A380-001','2023-10-05','16:00','18:30');
INSERT INTO `Flight Schedule` VALUES ('BA0029','R26','B737-003','2023-10-05','18:00','20:30');
INSERT INTO `Flight Schedule` VALUES ('BA0030','R38','A380-001','2023-10-06','08:00','10:30');
INSERT INTO `Flight Schedule` VALUES ('BA0031','R33','B757-001','2023-10-06','10:00','12:30');
INSERT INTO `Flight Schedule` VALUES ('BA0032','R04','A380-001','2023-10-06','12:00','14:30');
INSERT INTO `Flight Schedule` VALUES ('BA0033','R07','B757-001','2023-10-06','14:00','16:30');
INSERT INTO `Flight Schedule` VALUES ('BA0034','R17','B737-001','2023-10-06','16:00','18:30');
INSERT INTO `Flight Schedule` VALUES ('BA0035','R19','A380-001','2023-10-07','18:00','10:30');
INSERT INTO `Flight Schedule` VALUES ('BA0036','R24','B737-002','2023-10-07','10:00','12:30');
INSERT INTO `Flight Schedule` VALUES ('BA0037','R37','A380-001','2023-10-07','10:00','14:30');
INSERT INTO `Flight Schedule` VALUES ('BA0038','R32','B757-002','2023-10-07','10:00','16:30');
INSERT INTO `Flight Schedule` VALUES ('BA0039','R12','A380-001','2023-10-07','10:00','18:30');
INSERT INTO `Flight Schedule` VALUES ('BA0040','R31','B757-001','2023-10-07','10:00','20:30');



INSERT INTO User VALUES ('0001','visithaaiya@gmail.com','$2b$12$R/NgYin.kMvDJqdoxa40KeDJel3PkebxCP/VbZtktm163W83hcVEC','Visitha Wikramasinghe','No 01, Katubedda,Sri Lanka','2000-05-06','200012700384','0712346578','S3687934','Frequent',4,'Registered');
INSERT INTO User VALUES ('0002','mendiskusal@gmail.com','$2b$12$xwGgNaHSfiXW.ucsubeyBe68uJRObhxj1mLKg93eWResw64nXRHxO','Kusal Mendis','No 13, Moratuwa, Sri Lanka','1995-02-02','199503024532','0714565677','B4123287','Frequent',5,'Registered');
INSERT INTO User VALUES ('0003','dimuthkarunarathne@gmail.com','$2b$12$l0E9//RmGeiArKQDedH15O3iQpIfr3kAXSpNG3CIO1JFZBusmpoF2','Dimuth Karunarathne','No 10, Highlevel Road, Colombo 10, Sri Lanka','1998-04-21','198809753876','0723546567','D4129863','Gold',15,'Registered');
INSERT INTO User VALUES ('0004','hasarangawani@gmail.com','$2b$12$NSM2L8kohl8EKhRiXvr7mORV1Vjh7UV8af6d1kRZHVtg8udqL..ee','Wanindu Hasaranga','No 24, Ambalangoda, Sri Lanka','1997-07-29','199720097865','0767878789','U6521895','Gold',14,'Registered');
INSERT INTO User VALUES ('0005','theekshanamaheesh@gmail.com','$2b$12$mrSt1JHf3aMrV3t8WDhPf.jaDwna4965tOnntoVnsDH0AS0moc.l.','Maheesh Theekshana','No 43, Kottawa, Sri Lanka','2000-08-01','200032124765','0712465767','P8534896','Frequent',3,'Registered');
INSERT INTO User VALUES ('0006','chrissilverwood@gmail.com','$2b$12$8k4754Jj.qLgRnIJXN267eZIWNBLJ.SnmRuWd62GmaTXXqMjmvCdy','Chris Silverwood','No 221, Bangkok, Thailand','1975-03-05','197509564532','0712347886','N6732845','Gold',12,'Registered');
INSERT INTO User VALUES ('0007','rootjoe@gmail.com','$2b$12$tdtwUXNcZbilDEpXawhJvOJdHGmSOFHtLGBVrqdRTlgf0Z.dQbumu','Joe Root','No 21, Jakarta, Indonesia','1990-12-30','199036456453','0716876889','M5349812','Gold',15,'Registered');
INSERT INTO User VALUES ('0008','smithsteve@gmail.com','$2b$12$kgSzgBDceu0aovvjbn3byO9tflOcNszWXTFUl/hub.AI9CIIs4Vcm','Steve Smith','No 52, Chiang Mai, Thailand','1989-06-02','198915674352','0763435437','D3498609','Gold',13,'Registered');
INSERT INTO User VALUES ('0009','williamson@gmail.com','$2b$12$aoN8jmAT7j/pU4FVR6LkQOyrHtJOImme8/BolRGPlIeH.UcW37Esy','Kane Williamson','No 67, Phuket, Thailand','1990-08-08','199018967890','0723546578','K7809453','Frequent',2,'Registered');
INSERT INTO User VALUES ('0010','maxwellglenn@gmail.com','$2b$12$korVrj.m01LNRLytHSIhWuUhFXgT4Z7MCDsi1yHNPquaTVEaJRpKq','Glenn Maxwell','No 10, Surabaya, Indonesia','1988-10-14','198820567890','0712345656','L5467239','Frequent',5,'Registered');
INSERT INTO User VALUES ('0011','benstokes@gmail.com','$2b$12$R5I8tOqEbUm2lOTtSL3OPeHVI18wRl2yNq8Lrds0rl1ejlC8GMTdC','Ben Stokes','No 12, Bali, Indonesia','1991-06-04','199115324567','0723454566','A3451298','Frequent',5,'Registered');
INSERT INTO User VALUES ('0012','davidwarner@gmail.com','$2b$12$LXYBqofYUTMHxzhEAo2Ym.pjVIDTsQt5iQY/Lg18rYzn916WjYjma','David Warner','No 16, Pattaya City, Thailand','1986-10-27','198625987685','0712345467','C5687934','Frequent',7,'Registered');
INSERT INTO User VALUES ('0013','sharmarohit@gmail.com','$2b$12$G8Iay7t3.eq9lxPdBNpAy.waqnwJW41gWwXqMV1.fGVh8leXbbMzm','Rohit Sharma','No. 15, Gujarat, India','1987-04-10','198709324567','0724565687','A5987230','Frequent',4,'Registered');
INSERT INTO User VALUES ('0014','viratkohli@gmail.com','$2b$12$lL/wOfaUMP05tPqaFRX77OukYsxZdZoKkhLglSl0Gal1s/cQxe4nS','Virat Kohli','No 43, New Delhi, India','1988-11-05','198833454324','0712346578','H5698276','Gold',12,'Registered');
INSERT INTO User VALUES ('0015','kishanishan@gmail.com','$2b$12$jvi0TJHfvFdlfvcyaPC/W.86ifK2xttBHGrrxm.Y/ABCjEowRc4kO','Ishan Kishan','No 77, Karnataka, India','1998-07-18','199818767890','0712346578','J7094532','Frequent',4,'Registered');
INSERT INTO User VALUES ('0016','azambabar@gmail.com','$2b$12$9Po0n1yTdGmp2yhEMWiiSO9wNJCBrPrN/OCKUd22akEhKrSh4T17S','Babar Azam','No 88, Peshawar, Pakistan','1994-10-15','199427896587','0712567768','L8795643','Gold',12,'Registered');
INSERT INTO User VALUES ('0017','rizwanmohommad@gmail.com','$2b$12$b/RmDlAayuhZh61/179dUehsNoVISV/4JuLaE3gQB3TCD.Zh889.a','Mohommad Rizwan','No 45, Karachi, Pakistan','1992-06-01','199216435768','0714657877','E3484521','Frequent',4,'Registered');
INSERT INTO User VALUES ('0018','afridishaheen@gmail.com','$2b$12$LsFZxb1Vuvu8YTKYSIs5huS8EJ8GirVdZ./DMOreYnkbJYPaSPQ12','Shaheen Afridi','No 32, Islamabad, Pakistan ','2000-04-06','200007657834','0715768798','K8054312','Gold',12,'Registered');
INSERT INTO User VALUES ('0019','naseemshah@gmail.com','$2b$12$h/uoVmaXkZXtTVtewRakkugLX6skJVb0g4OxUWHpILR9soafNyPJ.','Naseem Shah','No 45, Peshawar, Pakistan','2003-02-15','200304567234','0723545656','B7839864','Frequent',4,'Registered');
INSERT INTO User VALUES ('0020','bumrahjasprit@gmail.com','$2b$12$BnY7IFCIHpJggcHF4fZWaOTOo1XGQXLuxJwVT2VmGNDQdZTP.s1bu','Jasprit Bumrah','No 223, Mumbai, India','1993-12-06','199334352134','0718998995','H7834965','Frequent',7,'Registered');
INSERT INTO User VALUES ('0021','andersonjames@gmail.com','$2b$12$1RK6JbbVIn24v1uyD1RzguUokkYTtExeN65QcsC0i42MXiuUZLl0y','James Anderson','No 24, London, England','1982-07-30','198220786542','0711324354','L9058123','Frequent',5,'Registered');
INSERT INTO User VALUES ('0022','brettlee@gmail.com','$2b$12$60IFWj8w9gt5arbkXvAli.b7xnMY/uN2w2I6Ex/EWE1ylLZLDUfq.','Brett Lee','No 64, Melbourne, Australia','1976-11-08','197627653458','0714565768','U7843567','Frequent',9,'Registered');
INSERT INTO User VALUES ('0023','shanewarne@gmail.com','$2b$12$kknafirNERTOq03zcJ6ZhOQl7u26LFUIBd73aa5iVdZo6HplRVn9C','Shane Warne','No 88, Perth, Australia','1969-09-13','196920234567','0723455646','K8943512','Frequent',8,'Registered');
INSERT INTO User VALUES ('0024','kumarsangakkara@gmail.com','$2b$12$bGWxATw8YCVBEZ3lwJbdietutxEUObyhQgQdLUMGQ//4.Fr677zg2','Kumar Sangakkara','No 34, Kandy, Sri Lanka','1977-10-27','197725671298','0714657667','L9078612','Frequent',8,'Registered');
INSERT INTO User VALUES ('0025','mahelajayawardene@gmail.com','$2b$12$4ANfnSmObkLIR5hCCo9lW.4uTedUVz4EGfXUqkDC6QMP6cdrlBN1q','Mahela Jayawardene','No 89, Colombo 5, Sri Lanka ','1977-05-27','197713659870','0715555657','M5671234','Gold',14,'Registered');


INSERT INTO Payment values("P0001",25000.00,"Success");
INSERT INTO Payment values("P0002",30000.00,"Success");
INSERT INTO Payment values("P0003",55000.00,"Success");
INSERT INTO Payment values("P0004",37500.00,"Success");
INSERT INTO Payment values("P0005",65000.00,"Success");
INSERT INTO Payment values("P0006",75750.00,"Success");



INSERT INTO Passenger values("B4123287","Kusal Mendis",'1995-02-02',"Male","0714565677");
INSERT INTO Passenger values("D4129863","Dimuth Karunarathne",'1988-04-21',"Male","0723546567");
INSERT INTO Passenger values("P8534896","Maheesh Theekshana",'2000-08-01',"Male","0712465767");
INSERT INTO Passenger values("M5349812","Joe Root",'1990-12-30',"Male","0716876889");
INSERT INTO Passenger values("D3498609","Steve Smith",'1989-06-02',"Male","0763435437");
INSERT INTO Passenger values("C5687934","David Warner",'1986-10-27',"Male","0712345467");



INSERT INTO Booking values("B0001","BA0001","0002",1,"Economy","P0001"); 
INSERT INTO Booking values("B0002","BA0002","0003",14,"Economy","P0002");
INSERT INTO Booking values("B0003","BA0001","0005",20,"Economy","P0003"); 
INSERT INTO Booking values("B0004","BA0002","0007",31,"Economy","P0004");
INSERT INTO Booking values("B0005","BA0001","0008",8,"Economy","P0005");  
INSERT INTO Booking values("B0006","BA0002","0012",12,"Economy","P0006");



INSERT INTO FlightDelaysEntity values("D0001","BA0004","Insufficient Fuel",124,"Yes","16:30");
INSERT INTO FlightDelaysEntity values("D0002","BA0008","Fault in engines",150,"Yes","14:20");



INSERT INTO `Seat Selection` values(1,"BA0001","Economy","booked");
INSERT INTO `Seat Selection` values(14,"BA0002","Economy","booked");
INSERT INTO `Seat Selection` values(20,"BA0001","Economy","booked");
INSERT INTO `Seat Selection` values(31,"BA0002","Economy","booked");
INSERT INTO `Seat Selection` values(8,"BA0001","Economy","booked");
INSERT INTO `Seat Selection` values(12,"BA0002","Economy","booked");



INSERT INTO Ticket values("T0001",'2023-09-25',"2",1,"BA0001","Economy","B0001","B4123287");  
INSERT INTO Ticket values("T0002",'2023-09-25',"1",14,"BA0002","Economy","B0002","D4129863");
INSERT INTO Ticket values("T0003",'2023-09-26',"2",20,"BA0001","Economy","B0003","P8534896");
INSERT INTO Ticket values("T0004",'2023-09-26',"3",31,"BA0002","Economy","B0004","M5349812");
INSERT INTO Ticket values("T0005",'2023-09-27',"1",8,"BA0001","Economy","B0005","D3498609");  
INSERT INTO Ticket values("T0006",'2023-09-27',"2",12,"BA0002","Economy","B0006","C5687934");


/*-------------TESTING PROCEDURES AND TRIGGERS-------------------------*/
CALL GetPassengersBelow18('BA0001');
CALL GetPassengersAbove18('BA0002');
CALL GetBookedSeatNumbers('BA0001','Economy');
CALL GetPassengersByDestination('BOM','2023-10-01','2023-10-05');
CALL GetPassengersByDestination('BKK','2023-10-01','2023-10-05');

CALL GetPassengersCountByClass('2023-10-01','2023-10-05');
