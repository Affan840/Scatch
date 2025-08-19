# Scatch - Full Stack E-commerce Application

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

[Live Preview](https://scatch-frontend-virid.vercel.app/)

## Project Structure

```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── .env
│   └── ...
└── frontend/
    ├── src/
    ├── .env
    └── ...
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
    PORT=3000
    MONGODB_URI=
    DB_NAME=
    JWT_SECRET=
    CORS_ORIGIN=http://localhost:5173
    NODE_ENV=development
    STRIPE_SECRET_KEY=
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variable:
   ```env
   VITE_BASE_URL=http://localhost:3000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (.env)

| Variable | Description | Default Value |
|----------|-------------|---------------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/scatch |
| JWT_SECRET | Secret key for JWT token generation | your_jwt_secret_key_here |
| CORS_ORIGIN | Allowed origin for CORS | http://localhost:5173 |
| NODE_ENV | Node environment | development |

### Frontend (.env)

| Variable | Description | Default Value |
|----------|-------------|---------------|
| VITE_BASE_URL | Backend API base URL | http://localhost:3000 |

## Features

- User authentication (login/register)
- Product browsing
- Shopping cart functionality
- Order placement
- Admin dashboard for product management
- Order tracking

## API Endpoints

### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login user
- `GET /users/logout` - Logout user

### Products
- `GET /products` - Get all products
- `POST /products` - Create a new product (admin only)
- `PUT /products/:id` - Update a product (admin only)
- `DELETE /products/:id` - Delete a product (admin only)

### Orders
- `POST /orders` - Create a new order
- `GET /orders/:userId` - Get user orders
- `GET /orders` - Get all orders (admin only)

## Common Issues & Solutions

### CORS Errors
If you encounter CORS errors:
1. Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL
2. Make sure both frontend and backend servers are running
3. Check that the backend is configured to allow credentials

### Login/Logout Issues
If login/logout is not working:
1. Verify `JWT_SECRET` is set in backend `.env`
2. Ensure cookies are enabled in your browser
3. Check that the frontend `VITE_BASE_URL` matches your backend URL

## Development

### Backend
- Framework: Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT tokens with cookies

### Frontend
- Framework: React with Vite
- Routing: React Router
- Styling: Tailwind CSS
- State Management: React Context API

## Deployment

### Backend
For production deployment:
1. Update `NODE_ENV` to "production" in `.env`
2. Update `JWT_SECRET` with a strong secret key
3. Update `MONGODB_URI` with your production database connection string
4. Update `CORS_ORIGIN` with your production frontend URL

### Frontend
For production deployment:
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Serve the built files from a static server or CDN

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.