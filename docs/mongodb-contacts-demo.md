# MongoDB Contacts Demo

This small CRUD demo uses the existing React/Vite frontend, Express API, and Mongoose model. The backend is the only part that connects to MongoDB; the browser calls the backend API.

The contacts endpoints are intentionally unauthenticated for local learning. Do not expose this demo publicly without adding authentication and appropriate access controls.

## Start MongoDB and MongoDB Compass

1. Install and start MongoDB Community Server, or create a MongoDB Atlas cluster.
2. Open MongoDB Compass and connect to the same URI used by the backend. For a local MongoDB server, use `mongodb://127.0.0.1:27017`.
3. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI` to your connection string. The example uses `mongodb://localhost:27017/cloudvault`.
4. Copy `client/.env.example` to `client/.env` if it does not already exist. Set `VITE_API_BASE_URL=http://localhost:5000/api`.

Do not put the MongoDB connection string in the frontend environment file. Keep database credentials in `server/.env`, and do not commit that file.

## Run the app

In one terminal:

```powershell
cd server
npm install
npm run dev
```

In another terminal:

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL shown in the client terminal. Add a contact; the API stores it in the `cloudvault` database's `contacts` collection. In Compass, refresh the connection and open that collection. MongoDB creates the database and collection on the first insert.

The REST endpoints are `GET /api/contacts`, `POST /api/contacts`, `PATCH /api/contacts/:id`, and `DELETE /api/contacts/:id`. `GET /api/health` reports the actual MongoDB connection state.
