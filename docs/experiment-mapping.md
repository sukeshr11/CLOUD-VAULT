# Experiment Mapping

This document maps the project requirements to the corresponding college laboratory experiments.

- **Experiment 2: RESTful Web Services**
  - **Feature**: Express Backend API (`/api/files`, `/api/activity`, etc.)
  - **Implementation**: The backend exposes endpoints using proper HTTP methods, validation (Zod), and error handling. It also consumes the JSONPlaceholder API (`/api/external/posts`).
  - **Testing**: A Postman collection is provided.

- **Experiment 3: Firebase Integration**
  - **Feature**: Real-Time Recent Activity
  - **Implementation**: The backend writes validated activity events to Firebase Realtime Database. The frontend subscribes to this feed for real-time dashboard updates.

- **Experiment 4: Auth0 Identity**
  - **Feature**: User Authentication & Authorization
  - **Implementation**: Auth0 is used to secure the frontend. Express backend validates JWTs to protect all private endpoints, ensuring users only access their own data.

- **Experiment 5: Dropbox API**
  - **Feature**: Cloud Storage Integration
  - **Implementation**: Real files uploaded to the application are transmitted by the backend to Dropbox using the Dropbox SDK. Metadata is stored in the database.

- **Experiment 6: MongoDB Atlas**
  - **Feature**: Database as a Service
  - **Implementation**: MongoDB Atlas stores user profiles, file metadata (size, internal ID, Dropbox reference), and activity logs.
