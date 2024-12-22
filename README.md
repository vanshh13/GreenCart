# GreenCart

GreenCart is a web and mobile platform designed for the sale and management of organic products. It provides a seamless shopping experience for customers and an efficient management system for administrators. The platform ensures secure transactions, real-time analytics, and user-friendly interfaces.

## Features

### For Customers
- **User Authentication:** Register and log in securely using email or social login (Google/Facebook).
- **Browse Products:** Search and filter organic products by categories, price, or availability.
- **Shopping Cart:** Add, remove, and update product quantities in the cart with real-time price calculation.
- **Order Management:** Place orders, track order status, and view order history.
- **Ratings and Reviews:** Provide feedback on purchased products to help other customers.

### For Admins
- **Product Management:** Add, edit, delete, and categorize products; manage inventory with low-stock alerts.
- **Order Management:** View and track customer orders.
- **Customer Management:** Access customer profiles and activity logs.
- **Analytics Dashboard:** View sales reports and user activity metrics.

## Technologies Used

### Frontend
- **Framework:** ReactJS
- **Styling:** CSS/SCSS, Material-UI

### Backend
- **Framework:** Node.js
- **Authentication:** OAuth2, JWT

### Database
- **Type:** MongoDB (NoSQL)

## Installation and Setup

### Prerequisites
1. Node.js and npm installed on your system.
2. MongoDB database instance (local or cloud-based).
3. Git for version control.

### Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/vanshh13/GreenCart.git
   ```
2. **Navigate to the Project Directory:**
   ```bash
   cd GreenCart
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Set Up Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   FACEBOOK_APP_ID=<your-facebook-app-id>
   FACEBOOK_APP_SECRET=<your-facebook-app-secret>
   ```
5. **Start the Development Server:**
   ```bash
   npm start
   ```
   The application will be accessible at `http://localhost:3000`.

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to the branch:
   ```bash
   git commit -m "Added feature-name"
   git push origin feature-name
   ```
