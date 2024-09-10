### Backend of Kyakhanahai.com

This repository contains the backend for kyakhanahai, a MERN stack project that helps users generate random meals from a list of saved dishes. The backend is built using Node.js and Express, and follows the MVCS (Model-View-Controller-Service) architecture.

### Table of Contents

- Project Overview
- Tech Stack
- Getting Started
- Prerequisites
- Installation
- Running the Application
- Configuration
- Project Structure
- Available Scripts
- API Endpoints
- Testing
- Contributing
- License

### Project Overview

The backend handles all server-side logic, including user authentication, dish management, and integration with external APIs. It provides a RESTful API for the frontend to interact with.

### Tech Stack

- Node.js – JavaScript runtime for server-side code.
- Express – Web application framework for Node.js.
- MongoDB – NoSQL database for storing user and dish data.
- Mongoose – ODM for MongoDB, used for data modeling.
- Cloudinary – Cloud storage service for managing images.
- jsonwebtoken – Library for generating and verifying JWTs.
- dotenv – Module for managing environment variables.

### Getting Started

Prerequisites
Node.js (v14 or higher)
npm or yarn as the package manager

### Installation

- Clone the repository:

git clone https://github.com/yourusername/kyakhanahai-backend.git
cd kyakhanahai-backend

- Install dependencies:
  npm install

# or

yarn install

### Running the Application

Create a .env file in the root directory with the necessary environment variables.

Start the server:

node index.js

The server will be running on http://localhost:3000.

### Configuration

- Environment Variables
  Create a .env file in the root directory and include the following keys:

GOOGLE_API_KEY=your_google_api_key_here
VITE_APP_CLOUD_NAME=your_cloudinary_cloud_name_here
VITE_APP_CLOUD_API_KEY=your_cloudinary_api_key_here
VITE_APP_CLOUD_API_SECRET=your_cloudinary_api_secret_here
ATLAS_DB_URL=your_mongo_atlas_connection_url_here
SECRET=any_random_string_here
JWT_SECRET=jwt_token_secret_here
GOOGLE_GEMINI_API=your_gemini_api_here
ALLOWED_URLS=all_apis_that_can_send_req_to_backend
FALLBACK_URL=if_no_url_is_found_navigate_to_this_link

- Configuration Files

cloudConfig.js: Configures Cloudinary storage.
db.js: Connects to MongoDB Atlas.
middleware.js: Handles JWT token decryption and other middleware logic.
index.js: Sets up CORS, routing, and other middlewares.

### Project Structure

Backend
├── models # Contains models for user and dish
├── controllers # Handles client requests and responses
├── services # Business logic and database interactions
├── config.js # Cloudinary configuration
├── db.js # MongoDB connection
├── middleware.js # JWT and other middleware
├── index.js # Main server file, middleware setup
├── .env # Environment variables
├── package.json
├── package-lock.json
└── .gitignore
└── .env

### Available Scripts

node index.js: Starts the server with live reloading (if configured).

### API Endpoints

POST /api/authenticate/upload: Uploads temporary profile image.
POST /api/authenticate/signup: Register a new user.
POST /api/authenticate/login: Log in and receive a JWT.
POST /api/authenticate/logout: Log out and destroy a JWT.
DELETE /api/authenticate/deleteaccount: Delete user account.

POST /api/dish/adddish: Add a new dish.
GET /api/dish/showdish: Retrieve all dishes.
GET /api/dish/getdish: Generates a random dish.
DELETE /api/dish/deletedish: Delete a dish.
POST /api/dish/generateDish: Generates a list of dish using GEMINI API.
GET /api/dish/getNearbyRestaurants: Gets list of nearby restaurant to users location

### Testing

Currently, there are no automated tests implemented. Future plans include adding unit and integration tests using tools like Jest.

### Contributing

At this time, contributions are not accepted. For feedback or suggestions, please contact via your-kash.cdac@gmail.com.

### License

MIT License
