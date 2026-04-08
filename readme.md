# ✈️ Air Scout - Flight Booking System

A simple full-stack flight booking system built using:

- Node.js
- Express.js
- PostgreSQL
- EJS (server-side rendering)
- Tailwind CSS

---

## 🚀 Setup Instructions

### 1. Install dependencies

npm install

---

### 2. Start the server

npm start

---

### 3. Open in browser

http://localhost:3000

---

## 🗄️ Database Setup (IMPORTANT)

Make sure PostgreSQL is installed.

Create a database:

flight_app

---

### Run these queries:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  email VARCHAR UNIQUE
);

CREATE TABLE flights (
  id SERIAL PRIMARY KEY,
  from_city VARCHAR,
  to_city VARCHAR,
  departure_time TIMESTAMP,
  price INT
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT,
  flight_id INT,
  status VARCHAR DEFAULT 'booked'
);

---

### Insert sample data:

INSERT INTO flights (from_city, to_city, departure_time, price) VALUES
('Delhi', 'Mumbai', NOW(), 5000),
('Bangalore', 'Delhi', NOW(), 6500),
('Mumbai', 'Goa', NOW(), 3000),
('Delhi', 'Jaipur', NOW(), 2000);

---

## ⚙️ Update DB Config

Go to:

src/config/db.js

Update your PostgreSQL credentials:

user: 'postgres'  
password: 'your_password'

---

## ✅ Features

- Search flights
- Book flights
- View bookings
- Cancel bookings

---

## 🧠 Note

Make sure PostgreSQL is running before starting the server.

---

## 👨‍💻 Author

Air Scout Project (V1)