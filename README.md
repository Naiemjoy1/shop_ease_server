# ShopEase - Backend

## Overview

The backend of ShopEase is built with Node.js and Express.js. It provides APIs for managing product data with features like searching, filtering, sorting, and pagination. Firebase is used for user authentication.

## Features

- **APIs:** RESTful endpoints for product management
- **Pagination:** Efficient loading of products with page navigation
- **Search:** Search products by name
- **Filter:** Filter products by brand, category, and price range
- **Sort:** Sort products by price and date added
- **Authentication:** Firebase authentication for Google and Email/Password
- **Dummy Data:** Includes at least 40 products

## Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Firebase** - Authentication

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance or MongoDB Atlas
- Firebase project credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Naiemjoy1/shop_ease_server

   ```

2. Navigate to the project directory:

   ```bash
   cd shop_ease_server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   MONGO_URI=<your-mongodb-uri>
   FIREBASE_API_KEY=<your-api-key>
   FIREBASE_AUTH_DOMAIN=<your-auth-domain>
   FIREBASE_PROJECT_ID=<your-project-id>
   FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
   FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
   FIREBASE_APP_ID=<your-app-id>
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Project Structure

- `models/` - Mongoose models for MongoDB
- `routes/` - API route handlers
- `controllers/` - Business logic for API routes
- `config/` - Configuration files (e.g., Firebase, MongoDB)
- `utils/` - Utility functions
- `server.js` - Main server file

### Running Tests

- Add test cases for your API endpoints.
- Run tests using:
  ```bash
  npm test
  ```

### Deployment

- To deploy the backend, follow the deployment guidelines for your hosting provider (e.g., Heroku, AWS).

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## Repository Links

- [Frontend Repository](https://github.com/Naiemjoy1/shop_ease_client)
- [Backend Repository](https://github.com/Naiemjoy1/shop_ease_server)
