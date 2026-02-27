# Vaccination Tracker - Full-Stack Application

## Overview

This project is a full-stack web application developed for the SE3040 - Application Frameworks module at SLIIT. It is a healthcare system designed to track vaccination schedules and updates for all age groups. Users can manage profiles, view vaccine catalogs, schedule appointments, log immunization records, and submit feedback/tickets for issues like side effects or complaints.

The backend is built with Express.js (Node.js) and MongoDB, structured into modular components (User Management, Vaccine Catalog & Scheduling, Appointment Management, Immunization Log & Records, Feedback/Ticketing System). It includes RESTful APIs with CRUD operations, third-party API integrations (e.g., CDC for vaccine info, Twilio for notifications), protected routes (JWT/role-based), validation, error handling, and clean architecture.

The frontend is built with React (using hooks/Context API for state management), consuming the backend APIs. UI/UX uses Tailwind CSS for responsive design, with session management via localStorage/JWT.


Group Members:
- IT23401662 -Samarathunga J.M (Appointments & Clinics Management)
- IT23174658 -Gunaweera T.C (User Management & Auth)
- IT23279698 -J.D Jayatilake (Vaccine Catalog Management)
- IT23400290 -W.A.S Tharaka (Immunization Logs Management)

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
1. **Install Dependencies**:
   - Backend: `cd backend && npm install`

2. **Run Locally (Without Docker)**:
   - Start MongoDB (if local: `mongod`).
   - Backend: `cd backend && npm start` (runs on http://localhost:5001).

## Running the Application

- **Backend APIs**: After starting, test with Postman/Swagger at `/api-docs` (Swagger integrated).
- **Frontend**: Login/register as user/doctor/admin to access features like booking appointments or submitting feedback.
- **Example Flow**: Register user → Browse vaccines → Book appointment → Log immunization → Submit feedback ticket.

## API Endpoint Documentation

All endpoints follow REST standards with HTTP methods and status codes. Authentication: JWT in `Authorization: Bearer <token>` header (from `/api/V1/users/login`).

### User Management Component
| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/V1/users/register | POST | Create user | { "name": "John", "age": 30, "phn": "12345", "role": "user", "password": "pass" } | { "id", "name", "token" } | None |
| /api/V1/users | GET | List users (admin) | - (Filters: ?age=30&search=John) | Array of users | Admin |
| /api/V1/users/:id | GET | Get profile | - | User object | User/Admin |
| /api/V1/users/profile | PUT | Update own profile | { "name": "Updated" } | Updated user | User/Admin |
| /api/V1/users/:id | PUT | Update user by ID | { "name": "Updated" } | Updated user | User/Admin |
| /api/V1/users/login | POST | Login | { "phn": "12345", "password": "pass" } | { "token" } | None |

Third-party: Twilio for OTP during registration.

### Vaccine Catalog Component
| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/V1/vaccines | POST | Create vaccine | { "name": "COVID-19", "dosesRequired": 2 } | Vaccine object | Admin |
| /api/V1/vaccines | GET | List vaccines (search/filter: ?ageGroup=adult) | - | Array with pagination | All |
| /api/V1/vaccines/:id | GET | Get details | - | Vaccine object | All |
| /api/V1/vaccines/:id | PUT | Update | { "description": "Updated" } | Updated vaccine | Admin |
| /api/V1/doses/vaccine/:vaccineId | POST | Create dose | { "doseNumber": 1, "minAge": { "value": 0 } } | Dose object | Admin |
| /api/V1/doses/vaccine/:vaccineId | GET | Get vaccine doses | - | Array of doses | All |
| /api/V1/doses/:id | GET | Get dose details | - | Dose object | All |
| /api/V1/doses/:id | PUT | Update dose | { "doseNumber": 1 } | Updated dose | Admin |
| /api/schedules/:userId | GET | Generate schedule | - | Personalized plan | User *(Not yet implemented)* |

Third-party: CDC API for vaccine details.

### Appointment Management Component
| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/V1/appointments/create | POST | Book appointment | { "vaccineId": "id", "date": "2026-03-01" } | Appointment object | Patient |
| /api/V1/appointments | GET | List (pagination: ?page=1&status=pending) | - | Array | Admin |
| /api/V1/appointments/:id | GET | View details | - | Appointment object | Patient/Doctor/Admin |
| /api/V1/appointments/:id | PUT | Update/cancel | { "status": "cancelled" } | Updated appointment | Patient/Admin |
| /api/V1/appointments/:id | DELETE | Delete | - | { "message": "Deleted" } | Patient/Admin |
| /api/V1/clinics/create | POST | Create clinic | { "name": "Clinic A", "location": "Address" } | Clinic object | Admin |
| /api/V1/clinics | GET | List clinics | - | Array of clinics | Patient/Doctor/Admin |
| /api/V1/clinics/:id | GET | Get clinic details | - | Clinic object | Patient/Doctor/Admin |
| /api/V1/clinics/:id | PUT | Update clinic | { "name": "Updated" } | Updated clinic | Admin |
| /api/V1/clinics/:id | DELETE | Delete clinic | - | { "message": "Deleted" } | Admin |

Third-party: Google Calendar/Twilio for reminders.

### Immunization Log & Records Component
| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/V1/logs | POST | Create log | { "vaccineId": "id", "dateAdministered": "2026-02-25" } | Log object | Doctor/Patient/Admin |
| /api/V1/logs | GET | List history (search: ?date=2026-02) | - | Array | Patient/Doctor/Admin |
| /api/V1/logs/:id | GET | View log | - | Log with certificate | Patient/Doctor/Admin |
| /api/V1/logs/:id | PUT | Update notes | { "notes": "No side effects" } | Updated log | Doctor/Admin |
| /api/V1/logs/:id | DELETE | Delete log | - | { "message": "Deleted" } | Admin |

Third-party: PubChem for side-effect info.

### Feedback/Ticketing System Component
**Status**: *Not yet implemented*

| Endpoint | Method | Description | Request Body/Example | Response Format | Auth Requirements |
|----------|--------|-------------|----------------------|-----------------|-------------------|
| /api/V1/feedback | POST | Create ticket | { "title": "Side Effect", "description": "Headache after shot" } | Ticket object | User/Doctor |
| /api/V1/feedback | GET | List tickets (filter: ?status=open) | - | Array | User/Admin |
| /api/V1/feedback/:id | GET | View ticket | - | Ticket object | User/Admin |
| /api/V1/feedback/:id | PUT | Update/response | { "status": "resolved", "response": "Advised rest" } | Updated ticket | Doctor/Admin |
| /api/V1/feedback/:id | DELETE | Delete | - | { "message": "Deleted" } | Admin |

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

Environment Variables Used: MONGO_URI, JWT_SECRET, TWILIO_SID (backend); REACT_APP_API_URL (frontend).

## Contributors
- Group project for SE3040 - 2026.

