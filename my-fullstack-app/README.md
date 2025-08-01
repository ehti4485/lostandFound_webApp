# My Fullstack App

This project is a fullstack application consisting of a Next.js frontend and a Node.js backend. Below are the instructions for setting up and running both parts of the application.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Project Structure

```
my-fullstack-app
├── backend          # Node.js backend
│   ├── src         # Source files for the backend
│   ├── package.json # Backend dependencies and scripts
│   ├── tsconfig.json # TypeScript configuration for the backend
│   └── README.md    # Documentation for the backend
└── frontend         # Next.js frontend
    ├── src         # Source files for the frontend
    ├── package.json # Frontend dependencies and scripts
    ├── tailwind.config.js # Tailwind CSS configuration
    ├── tsconfig.json # TypeScript configuration for the frontend
    └── README.md    # Documentation for the frontend
```

## Setup Instructions

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the backend dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

## Accessing the Application

- The backend API will be available at `http://localhost:5000/api` (or the port specified in your backend configuration).
- The frontend application will be available at `http://localhost:3000`.

## Additional Information

Refer to the individual `README.md` files in the `backend` and `frontend` directories for more detailed instructions and information specific to each part of the application.