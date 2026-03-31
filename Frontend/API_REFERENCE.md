# API Reference Guide - Vaccine Catalog

Complete API reference for the vaccine and dose endpoints used by the frontend.

## Base URL
```
http://localhost:5000/api
```

---

## 💉 Vaccine Endpoints

### 🔄 Get All Vaccines
```http
GET /vaccines
```

**Query Parameters:**
- `status` (optional): `active` | `discontinued` | `pending` | `archived`

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/vaccines?status=active"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123abc",
      "name": "COVID-19 Vaccine",
      "genericName": "mRNA COVID-19 Vaccine",
      "manufacturer": "Pfizer",
      "cvxCode": "208",
      "description": "mRNA vaccine",
      "presentation": "vial",
      "volume": { "value": 1, "unit": "mL" },
      "storageRequirements": {
        "minTemp": -80,
        "maxTemp": -60,
        "requiresRefrigeration": true
      },
      "totalDoses": 2,
      "status": "active",
      "version": 1,
      "validFrom": "2024-01-01T00:00:00.000Z",
      "validUntil": null,
      "updateReason": "Initial creation",
      "approvedRegions": [],
      "contraindications": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 📄 Get Single Vaccine
```http
GET /vaccines/:id
```

**Path Parameters:**
- `id` (required): Vaccine MongoDB ObjectID

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/vaccines/123abc"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "123abc",
    "name": "COVID-19 Vaccine",
    // ... full vaccine object
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Vaccine not found"
}
```

---

### ✨ Create Vaccine
```http
POST /vaccines
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "COVID-19 Vaccine",
  "genericName": "mRNA COVID-19 Vaccine",
  "manufacturer": "Pfizer",
  "cvxCode": "208",
  "description": "mRNA vaccine against COVID-19",
  "presentation": "vial",
  "volume": {
    "value": 1,
    "unit": "mL"
  },
  "storageRequirements": {
    "minTemp": -80,
    "maxTemp": -60,
    "requiresRefrigeration": true
  },
  "totalDoses": 2,
  "status": "active",
  "updateReason": "Initial creation",
  "approvedRegions": [],
  "contraindications": []
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "123abc",
    "name": "COVID-19 Vaccine",
    // ... created vaccine object
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "errors": [
    "Vaccine name must be at least 2 characters",
    "CVX code is required (numeric)"
  ]
}
```

---

### ✏️ Update Vaccine
```http
PUT /vaccines/:id
Content-Type: application/json
```

**Path Parameters:**
- `id` (required): Vaccine MongoDB ObjectID

**Request Body:**
```json
{
  "name": "COVID-19 Vaccine Updated",
  "status": "discontinued",
  "updateReason": "Updated for variant"
  // Only include fields to update
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "123abc",
    "name": "COVID-19 Vaccine Updated",
    "version": 2,
    // ... updated vaccine object
  }
}
```

---

### 🗑️ Delete Vaccine (Soft Delete)
```http
DELETE /vaccines/:id
Content-Type: application/json
```

**Path Parameters:**
- `id` (required): Vaccine MongoDB ObjectID

**Request Body:**
```json
{
  "reason": "Discontinued product"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "123abc",
    "status": "archived",
    "message": "Vaccine soft deleted successfully"
  }
}
```

---

### 📚 Get Vaccine History
```http
GET /vaccines/:id/history
```

**Path Parameters:**
- `id` (required): Vaccine MongoDB ObjectID

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/vaccines/123abc/history"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "version": 1,
      "updateReason": "Initial creation",
      "validFrom": "2024-01-01T00:00:00.000Z",
      "status": "active"
    },
    {
      "version": 2,
      "updateReason": "Updated for variant",
      "validFrom": "2024-02-01T00:00:00.000Z",
      "validUntil": "2024-03-01T00:00:00.000Z",
      "status": "superseded"
    }
  ]
}
```

---

## 💉 Dose Endpoints

### 🔄 Get Vaccines Doses
```http
GET /doses/vaccine/:vaccineId
```

**Path Parameters:**
- `vaccineId` (required): Vaccine MongoDB ObjectID

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/doses/vaccine/123abc"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "dose123",
      "vaccineId": "123abc",
      "doseNumber": 1,
      "doseName": "Dose 1",
      "minAge": { "value": 18, "unit": "years" },
      "maxAge": { "value": null, "unit": "years" },
      "intervalFromPrevious": {
        "minDays": 0,
        "maxDays": null,
        "exactDays": null
      },
      "allowableDelay": 0,
      "priority": "routine",
      "status": "active",
      "version": 1,
      "validFrom": "2024-01-01T00:00:00.000Z",
      "notes": "Initial dose",
      "guidelines": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 📄 Get Single Dose
```http
GET /doses/:id
```

**Path Parameters:**
- `id` (required): Dose MongoDB ObjectID

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/doses/dose123"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "dose123",
    "vaccineId": "123abc",
    // ... full dose object
  }
}
```

---

### ✨ Create Dose
```http
POST /doses/vaccine/:vaccineId
Content-Type: application/json
```

**Path Parameters:**
- `vaccineId` (required): Vaccine MongoDB ObjectID

**Request Body:**
```json
{
  "doseNumber": 1,
  "doseName": "First Dose",
  "minAge": { "value": 18, "unit": "years" },
  "maxAge": { "value": null, "unit": "years" },
  "intervalFromPrevious": {
    "minDays": 0,
    "maxDays": null,
    "exactDays": null
  },
  "allowableDelay": 0,
  "priority": "routine",
  "status": "active",
  "notes": "Standard first dose",
  "guidelines": [
    {
      "authority": "WHO",
      "reference": "COVID-19 Guidelines",
      "url": "https://example.com"
    }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "dose123",
    "vaccineId": "123abc",
    // ... created dose object
  }
}
```

---

### ✏️ Update Dose
```http
PUT /doses/:id
Content-Type: application/json
```

**Path Parameters:**
- `id` (required): Dose MongoDB ObjectID

**Request Body:**
```json
{
  "minAge": { "value": 16, "unit": "years" },
  "status": "superseded",
  // Only include fields to update
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "dose123",
    "minAge": { "value": 16, "unit": "years" },
    "version": 2,
    // ... updated dose object
  }
}
```

---

### 🗑️ Delete Dose
```http
DELETE /doses/:id
```

**Path Parameters:**
- `id` (required): Dose MongoDB ObjectID

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/doses/dose123"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "dose123",
    "message": "Dose deleted successfully"
  }
}
```

---

### 📊 Calculate Due Date
```http
POST /doses/calculate
Content-Type: application/json
```

**Request Body:**
```json
{
  "vaccineId": "123abc",
  "patientAgeMonths": 18,
  "lastDoseDate": "2024-01-01T00:00:00.000Z",
  "doseNumber": 2
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "nextDueDate": "2024-02-28T00:00:00.000Z",
    "minDueDate": "2024-02-15T00:00:00.000Z",
    "maxDueDate": "2024-03-10T00:00:00.000Z",
    "daysUntilDue": 58,
    "status": "upcoming"
  }
}
```

---

## 🔴 Error Codes

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Vaccine retrieved |
| 201 | Created | Vaccine created |
| 400 | Bad Request | Invalid vaccine data |
| 404 | Not Found | Vaccine ID doesn't exist |
| 500 | Server Error | Database connection error |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "data": [] // Optional: additional error data
}
```

---

## 📋 Data Models

### Vaccine Schema
```javascript
{
  _id: ObjectID,
  name: String (required, unique),
  genericName: String (required),
  manufacturer: String (required),
  cvxCode: String (required, unique),
  description: String,
  presentation: String (enum: vial, prefilled syringe, nasal spray, oral),
  volume: {
    value: Number (required),
    unit: String (default: mL)
  },
  storageRequirements: {
    minTemp: Number,
    maxTemp: Number,
    requiresRefrigeration: Boolean
  },
  totalDoses: Number (required, min: 1),
  status: String (enum: active, discontinued, pending, archived),
  version: Number,
  validFrom: Date,
  validUntil: Date,
  updateReason: String,
  approvedRegions: [{
    country: String,
    approvalDate: Date,
    regulatoryBody: String
  }],
  contraindications: [{
    condition: String,
    severity: String,
    description: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Dose Schema
```javascript
{
  _id: ObjectID,
  vaccineId: ObjectID (required, ref: Vaccine),
  doseNumber: Number (required, min: 1),
  doseName: String,
  minAge: {
    value: Number (required),
    unit: String (required)
  },
  maxAge: {
    value: Number,
    unit: String
  },
  intervalFromPrevious: {
    minDays: Number,
    maxDays: Number,
    exactDays: Number
  },
  allowableDelay: Number,
  priority: String (enum: routine, catchup, special),
  status: String (enum: active, superseded, pending),
  version: Number,
  validFrom: Date,
  validUntil: Date,
  notes: String,
  guidelines: [{
    authority: String,
    reference: String,
    url: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Example Workflows

### Create a Complete Vaccine Schedule

**Step 1: Create Vaccine**
```bash
curl -X POST http://localhost:5000/api/vaccines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Influenza Vaccine",
    "genericName": "Seasonal Flu Vaccine",
    "manufacturer": "Sanofi",
    "cvxCode": "149",
    "totalDoses": 1,
    "presentation": "vial",
    "volume": {"value": 0.5, "unit": "mL"}
  }'
```

**Step 2: Create First Dose Requirement**
```bash
curl -X POST http://localhost:5000/api/doses/vaccine/[VACCINE_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "doseNumber": 1,
    "minAge": {"value": 6, "unit": "months"},
    "priority": "routine",
    "notes": "Annual flu vaccine"
  }'
```

**Step 3: Get All Doses**
```bash
curl -X GET http://localhost:5000/api/doses/vaccine/[VACCINE_ID]
```

---

## 💡 Tips for API Usage

1. **Always include Content-Type header** for POST/PUT requests
2. **Handle errors appropriately** in your frontend
3. **Use query parameters** for filtering instead of multiple requests
4. **Store IDs in variables** for complex workflows
5. **Test endpoints** with Postman before integrating
6. **Monitor response times** for performance
7. **Implement request timeouts** to prevent hanging

---

## 🔗 Frontend Implementation

The frontend automatically uses these endpoints through `src/services/api.js`:

```javascript
import { vaccineAPI, doseAPI } from './services/api'

// Simple usage
const vaccines = await vaccineAPI.getAllVaccines()
const doses = await doseAPI.getVaccineDoses(vaccineId)
```

---

## 📚 Related Documentation

- [Frontend README](./src/components/VaccineCatalog/README.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Quick Start](./QUICKSTART.md)
