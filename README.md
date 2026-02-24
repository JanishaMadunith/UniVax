# Vaccination Tracker - Full-Stack Application

## Overview

This project is a full-stack web application developed for the SE3040 - Application Frameworks module at SLIIT. It is a healthcare system designed to track vaccination schedules and updates for all age groups. Users can manage profiles, view vaccine catalogs, schedule appointments, log immunization records, and submit feedback/tickets for issues like side effects or complaints.

The backend is built with Express.js (Node.js) and MongoDB, structured into modular components (User Management, Vaccine Catalog & Scheduling, Appointment Management, Immunization Log & Records, Feedback/Ticketing System). It includes RESTful APIs with CRUD operations, third-party API integrations (e.g., CDC for vaccine info, Twilio for notifications), protected routes (JWT/role-based), validation, error handling, and clean architecture.

The frontend is built with React (using hooks/Context API for state management), consuming the backend APIs. UI/UX uses Tailwind CSS for responsive design, with session management via localStorage/JWT.

This repo follows best practices, including Docker for microservices-like deployment of components for scalability and isolation.

Group Members:
- [Your Name] (Feedback/Ticketing Component)
- [Member 2] (Vaccine Catalog & Scheduling)
- [Member 3] (Appointment Management)
- [Member 4] (User Management & Auth)

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT for auth, Axios for third-party APIs, Joi for validation.
- **Frontend**: React.js (Hooks, Context API/Redux), Tailwind CSS/Bootstrap, Axios for API calls.
- **Deployment**: Backend on Render/Railway (Dockerized), Frontend on Vercel/Netlify.
- **Testing**: Jest/Supertest (unit/integration), Artillery.io (performance).
- **Other**: Swagger/Postman for API docs, Docker & docker-compose for containerization.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Git
- Docker (optional for microservices)

### Step-by-Step Guide
1. **Clone the Repository**:
   ```
   git clone https://github.com/your-group-repo/vaccination-tracker.git
   cd vaccination-tracker
   ```

2. **Install Dependencies**:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`

3. **Configure Environment Variables**:
   Create `.env` files in backend and frontend roots.
   - Backend `.env` example:
     ```
     MONGO_URI=mongodb://localhost:27017/vaccination-db  # Or Atlas URI
     JWT_SECRET=your-secret-key
     TWILIO_SID=your-twilio-sid
     TWILIO_TOKEN=your-twilio-token
     TWILIO_NUMBER=+1234567890
     PORT=3000
     ```
   - Frontend `.env` example:
     ```
     REACT_APP_API_URL=http://localhost:3000/api
     ```

4. **Run Locally (Without Docker)**:
   - Start MongoDB (if local: `mongod`).
   - Backend: `cd backend && npm start` (runs on http://localhost:3000).
   - Frontend: `cd frontend && npm start` (runs on http://localhost:3000).

5. **Run with Docker (Microservices Mode)**:
   - Ensure Docker is running.
   - Build and start: `docker-compose up --build`.
   - Access: Backend services on exposed ports (e.g., feedback on 3001), Frontend manually or integrate.

## Running the Application

- **Backend APIs**: After starting, test with Postman/Swagger at `/api-docs` (Swagger integrated).
- **Frontend**: Login/register as user/doctor/admin to access features like booking appointments or submitting feedback.
- **Example Flow**: Register user → Browse vaccines → Book appointment → Log immunization → Submit feedback ticket.

## API Endpoint Documentation

All endpoints follow REST standards with HTTP methods and status codes. Authentication: JWT in `Authorization: Bearer <token>` header (from `/auth/login`).

### User Management Component
| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/users/register | POST | Create user | { "name": "John", "age": 30, "phn": "12345", "role": "user", "password": "pass" } | { "id", "name", "token" } | None |
| /api/users | GET | List users (admin) | - (Filters: ?age=30&search=John) | Array of users | Admin |
| /api/users/:id | GET | Get profile | - | User object | User/Admin |
| /api/users/:id | PUT | Update profile | { "name": "Updated" } | Updated user | User/Admin |
| /api/auth/login | POST | Login | { "phn": "12345", "password": "pass" } | { "token" } | None |

Third-party: Twilio for OTP during registration.

### Vaccine Catalog & Scheduling Component
| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/vaccines | POST | Create vaccine | { "name": "COVID-19", "dosesRequired": 2 } | Vaccine object | Admin |
| /api/vaccines | GET | List vaccines (search/filter: ?ageGroup=adult) | - | Array with pagination | All |
| /api/vaccines/:id | GET | Get details | - | Vaccine object | All |
| /api/vaccines/:id | PUT | Update | { "description": "Updated" } | Updated vaccine | Admin |
| /api/schedules/:userId | GET | Generate schedule | - | Personalized plan | User |

Third-party: CDC API for vaccine details.

### Appointment Management Component
| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/appointments | POST | Book appointment | { "vaccineId": "id", "date": "2026-03-01" } | Appointment object | User |
| /api/appointments | GET | List (pagination: ?page=1&status=pending) | - | Array | User/Admin |
| /api/appointments/:id | GET | View details | - | Appointment object | User/Admin |
| /api/appointments/:id | PUT | Update/cancel | { "status": "cancelled" } | Updated appointment | User/Admin |
| /api/appointments/:id | DELETE | Delete | - | { "message": "Deleted" } | Admin |

Third-party: Google Calendar/Twilio for reminders.

### Immunization Log & Records Component
| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/logs | POST | Create log | { "vaccineId": "id", "dateAdministered": "2026-02-25" } | Log object | Doctor/Admin |
| /api/logs | GET | List history (search: ?date=2026-02) | - | Array | User/Admin |
| /api/logs/:id | GET | View log | - | Log with certificate | User/Admin |
| /api/logs/:id | PUT | Update notes | { "notes": "No side effects" } | Updated log | Doctor/Admin |

Third-party: PubChem for side-effect info.

### Feedback/Ticketing System Component
| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/feedback | POST | Create ticket | { "title": "Side Effect", "description": "Headache after shot" } | Ticket object | User/Doctor |
| /api/feedback | GET | List tickets (filter: ?status=open) | - | Array | User/Admin |
| /api/feedback/:id | GET | View ticket | - | Ticket object | User/Admin |
| /api/feedback/:id | PUT | Update/response | { "status": "resolved", "response": "Advised rest" } | Updated ticket | Doctor/Admin |
| /api/feedback/:id | DELETE | Delete | - | { "message": "Deleted" } | Admin |

Third-party: Twilio for SMS notifications on updates.

Error Handling: Standard codes (400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error).

## Deployment

### Backend Deployment
- Platform: Render (Dockerized for microservices).
- Setup Steps:
  1. Create Render account.
  2. New Web Service > Connect GitHub repo.
  3. Runtime: Docker (uses Dockerfile).
  4. Add env vars: MONGO_URI, JWT_SECRET, etc. (no secrets exposed).
- Live URL: https://vaccination-backend.onrender.com
- Screenshots: [Deployment Success Screenshot] (add image link).

### Frontend Deployment
- Platform: Vercel.
- Setup Steps:
  1. Create Vercel account.
  2. Import GitHub repo > Deploy.
  3. Add env var: REACT_APP_API_URL.
- Live URL: https://vaccination-tracker.vercel.app
- Screenshots: [Deployment Success Screenshot] (add image link).

Environment Variables Used: MONGO_URI, JWT_SECRET, TWILIO_SID (backend); REACT_APP_API_URL (frontend).

## Testing Instruction Report

### 1. Unit Testing
- Tools: Jest.
- Setup/Execution: `cd backend && npm test` (runs unit tests for services/controllers).
- Environment: Node.js local.
- Example: Tests isolation (e.g., mock Mongoose for feedback creation).

### 2. Integration Testing
- Tools: Supertest.
- Setup/Execution: `cd backend && npm run test:integration` (tests API-DB interactions, e.g., POST /feedback with auth).
- Environment: MongoDB test DB (set TEST_MONGO_URI in .env).

### 3. Performance Testing
- Tools: Artillery.io.
- Setup/Execution: Install globally (`npm i -g artillery`), run `artillery run performance.yml` (script: 10 users, 20 requests to /api/feedback).
- Environment: Local or deployed URL.
- Config Details: performance.yml example:
  ```
  config:
    target: 'http://localhost:3000'
  scenarios:
    - flow:
      - get: { url: '/api/feedback' }
  ```

## Contributors
- Group project for SE3040 - 2026.

For issues, create a GitHub issue or submit a feedback ticket in the app!
