# Backend Application

This is the backend part of the fullstack application built with Node.js, Express.js, and TypeScript.

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd my-fullstack-app/backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm run start
   ```

## API Endpoints

The backend exposes the following API endpoints under the `/api` prefix:

- **GET /api/items**: Retrieve a list of items.
- **POST /api/items**: Create a new item.
- **GET /api/items/:id**: Retrieve a specific item by ID.
- **PUT /api/items/:id**: Update a specific item by ID.
- **DELETE /api/items/:id**: Delete a specific item by ID.

## Development

- To run the application in development mode with hot reloading, use:
  ```
  npm run dev
  ```

## Technologies Used

- Node.js
- Express.js
- TypeScript
- CORS

## License

This project is licensed under the MIT License.