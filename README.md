# Airline Reservation System
A robust and scalable Airline Reservation System built with Node.js, Express, and MongoDB. This API allows users to authenticate, reserve seats, and reset reservations with comprehensive test coverage and detailed documentation.

## Table of Contents

- [Airline Reservation System](#airline-reservation-system)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Feature Description](#feature-description)
  - [User Authentication](#1-user-authentication)
  - [Seat Reservation](#2-seat-reservation)
  - [Seat Reset (Admin Only)](#3-seat-reset-admin-only)
  - [Authorization and Role-Based Access Control](#4-authorization-and-role-based-access-control)
  - [Traceability and Logging](#5-traceability-and-logging)
  - [Database Design](#6-database-design)
  - [Error Handling and Response Management](#7-error-handling-and-response-management)
  - [Scalability and Extensibility](#8-scalability-and-extensibility)
- [Test Coverage Report](#test-coverage-report)
- [API Documentation](#api-documentation)


## Features

- **User Authentication:** Secure JWT-based authentication with email validation and session management.
- **Seat Reservation:** Reserve seats with passenger details, ensuring seat number uniqueness and preventing duplicates.
- **Seat Reset (Admin Only):** Admin-only endpoint to reset all reservations and archive data for audit.
- **Role-Based Access Control:** Supports role-based access control for admin-specific functionalities.
- **Traceability and Logging:** Implements unique Trace IDs for request tracking and detailed logging with Winston.
- **Database Design:** Modular schema using MongoDB collections for `Users`, `Seats`, and `Reservations`.
- **Error Handling:** Comprehensive error responses with structured messages and appropriate HTTP status codes.
- **Scalability and Extensibility:** Modular codebase for easy feature extension and maintenance.


## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Jest, SuperTest
- **Logging:** Winston
- **CI/CD:** GitHub Actions

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** v14.x or later
- **npm:** Node Package Manager
- **MongoDB:** Local installation or access to a cloud-based MongoDB instance
- **Git:** Version control system

## Installation

1. **Clone the Repository and Navigate to the Project Directory**

     ```bash
     git clone https://github.com/ashugoyal6799/sukasa-air-backend.git
     cd sukasa-air-backend
     ```
2. **Install Dependencies**
     ```bash
     npm install
     ```
3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add the following:
   
    ```bash
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/sukasa_air
    JWT_SECRET=your_jwt_secret_key
    ADMIN_EMAILS=admin@sukasaair.com
    ```
4. **Start MongoDB server**
   Ensure MongoDB is running. As we are using transactions, we need a MongoDB replica set. You have two options:
   
   a. Run a local MongoDB replica set  
   b. Use a MongoDB cloud connection string (recommended for simplicity)

   Start your MongoDB server based on your chosen option.

   
6. **Run the Application**
     ```bash
     npm start
     ```
     The server should now be running at http://localhost:3000.
  
## Feature Description

This project implements a seat reservation system for **Sukasa Air**, covering essential functionality for user authentication, seat management, and admin operations. Below are the key features developed as part of the project:

### 1. **User Authentication**
   - Implemented a user authentication mechanism using **JWT (JSON Web Tokens)**.
   - Users can log in using their email addresses, which generates a session token for further requests.
   - Email validation is enforced using the `validator` library to ensure the email format is correct before processing the login request.
   - The system supports both normal users and admin users, with certain functionalities restricted based on roles.

### 2. **Seat Reservation**
   - The `/seat/reserve` endpoint allows authenticated users to reserve seats.
   - Users must provide the seat number and passenger details (name, phone number, and age) while reserving.
   - Seat numbers can range from 1 to 300, and validations are in place to prevent out-of-range or duplicate reservations.
   - If a seat is already reserved, the system prevents duplicate reservations and provides a clear error message.
   - Each successful reservation is stored in the `Reservation` collection in MongoDB, ensuring a unique mapping between seats and users.

### 3. **Seat Reset (Admin Only)**
   - Implemented a `/seat/reset` endpoint that allows only admin users to reset all seat reservations.
   - Only users with emails listed in the `ADMIN_EMAILS` environment variable can access this endpoint.
   - Upon reset, all reservations are archived in a separate collection (`ArchivedReservations`), maintaining a history of reservations for audit purposes.
   - This operation uses **MongoDB transactions** to ensure data integrity and consistency.

### 4. **Authorization and Role-Based Access Control**
   - The system supports role-based access control, with the `adminMiddleware` restricting certain endpoints to admin users only.
   - Admins are identified based on their email addresses, defined in the environment configuration.
   - All requests to protected endpoints are authenticated using the `authMiddleware`, which validates the JWT token.

### 5. **Traceability and Logging**
   - Integrated a unique `Trace ID` for each request to track operations effectively across different layers of the application.
   - Implemented detailed logging using the `Winston` library to capture and trace each user action, API call, and error.
   - The logs include information such as timestamps, trace IDs, and request details to help with debugging and monitoring.

### 6. **Database Design**
   - Used **MongoDB** to manage user, seat, and reservation data.
   - Defined separate collections for `Users`, `Seats`, and `Reservations` to keep the schema modular and scalable.
   - Applied unique constraints on seat numbers to prevent duplicate reservations and ensured each seat is uniquely identified.

### 7. **Error Handling and Response Management**
   - Implemented comprehensive error handling throughout the application.
   - Each endpoint returns structured error responses with appropriate HTTP status codes and descriptive messages.
   - Added middleware to handle invalid routes, ensuring that undefined endpoints return a `404 Not Found` response.

### 8. **Scalability and Extensibility**
   - The project follows a **modular architecture**, making it easy to extend and add new features.
   - Each component (controllers, services, repositories, and middleware) is separated to ensure high maintainability.
   - The code is written with scalability in mind, allowing easy integration of additional features, such as payment systems or flight scheduling.

## Test Coverage Report
The project achieved a high test coverage with **92.47%** of statements, **84.09%** of branches, **86.2%** of functions, and **92.77%** of lines covered, ensuring robust testing and reliability of the codebase.

Deatiled html report can be found on `test-report.html` at root directory of the project. 
Image URL shows the report recieved on terminal while running the test case: https://drive.google.com/file/d/1jZImAxJPAtyjZQGUutN9Z4kNnBG-VDJL/view?usp=sharing


## API Documentation
The complete API documentation is hosted on SwaggerHub. You can access it using the following link: [SwaggerHub API Documentation](<https://app.swaggerhub.com/apis/ASHUG6799/seat-reservation_api/1.0.0>).

