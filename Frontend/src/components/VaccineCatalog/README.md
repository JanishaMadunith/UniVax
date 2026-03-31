# Vaccine Catalog Frontend

A comprehensive React frontend for managing vaccines and their dosing requirements in the UniVax application.

## 📁 Project Structure

```
Frontend/src/components/
├── VaccineCatalog/
│   ├── VaccineCatalog.jsx          # Main entry component
│   ├── Vaccines/
│   │   ├── VaccineList.jsx         # List and manage vaccines
│   │   ├── VaccineForm.jsx         # Create/edit vaccines
│   │   └── VaccineDetail.jsx       # View vaccine details
│   └── Doses/
│       ├── DoseList.jsx            # List and manage doses
│       ├── DoseForm.jsx            # Create/edit doses
│       └── DoseDetail.jsx          # View dose details
└── services/
    └── api.js                       # API integration service
```

## 🚀 Features

### Vaccine Management
- **Create Vaccines**: Add new vaccines with comprehensive details
  - Basic info (name, generic name, manufacturer, CVX code)
  - Presentation type and volume
  - Storage requirements (temperature, refrigeration)
  - Total doses
  - Status tracking (active, discontinued, pending, archived)

- **View Vaccines**: Browse all vaccines with filtering
  - Filter by status
  - Quick preview of vaccine details
  - Access vaccine history/versions

- **Edit Vaccines**: Update vaccine information with version control

- **Delete Vaccines**: Soft delete vaccines with reason tracking

- **Vaccine History**: View all versions and updates of a vaccine

### Dose Management
- **Create Dose Requirements**: Define dosing schedules for vaccines
  - Dose number and naming
  - Age requirements (minimum and maximum)
  - Interval requirements from previous dose
  - Priority levels (routine, catchup, special)
  - Status tracking

- **View Doses**: List all doses for a vaccine
  - Filter by status
  - Quick preview of dose requirements
  - Age range and interval information

- **Edit Doses**: Update dose requirements with version control

- **Delete Doses**: Remove dose requirements

- **Guidelines**: Add and manage vaccination guidelines with authority sources

## 📦 API Integration

The frontend connects to the following backend endpoints:

### Vaccine Endpoints
```
GET    /api/vaccines              # Get all vaccines (with filters)
GET    /api/vaccines/:id          # Get single vaccine
POST   /api/vaccines              # Create vaccine
PUT    /api/vaccines/:id          # Update vaccine
DELETE /api/vaccines/:id          # Delete vaccine
GET    /api/vaccines/:id/history  # Get vaccine history
```

### Dose Endpoints
```
GET    /api/doses/vaccine/:vaccineId       # Get vaccines doses
GET    /api/doses/:id                      # Get single dose
POST   /api/doses/vaccine/:vaccineId       # Create dose
PUT    /api/doses/:id                      # Update dose
DELETE /api/doses/:id                      # Delete dose
POST   /api/doses/calculate                # Calculate due date
```

## 🎨 Components Overview

### VaccineCatalog (Main Component)
Entry point with tab navigation between vaccines and doses sections.

```jsx
import VaccineCatalog from './components/VaccineCatalog/VaccineCatalog'

<Route path="/vaccines" element={<VaccineCatalog />} />
```

### VaccineList
Displays all vaccines with:
- Status filtering
- Quick actions (edit, delete)
- Click to view details
- Create vaccine button

### VaccineForm
Form for creating/editing vaccines with:
- Full validation
- Storage requirements configuration
- Status management
- Error handling with toast notifications

### VaccineDetail
Detailed view of a vaccine with:
- All vaccine information
- Associated dose requirements
- Version history
- Approved regions
- Contraindications

### DoseList
Displays all doses for a vaccine with:
- Status & priority filtering
- Quick actions (edit, delete)
- Age range and interval display
- Create dose button

### DoseForm
Form for creating/editing doses with:
- Dose scheduling configuration
- Age requirement setup
- Interval settings (min, max, exact)
- Guideline management
- Priority and status selection

### DoseDetail
Detailed view of a dose with:
- All dose information
- Age requirements
- Interval specifications
- Associated guidelines
- Version information

## 🔌 API Service

The `api.js` service provides:

```javascript
// Vaccine API
vaccineAPI.getAllVaccines(filters)        // Get all vaccines
vaccineAPI.getVaccineById(id)             // Get single vaccine
vaccineAPI.createVaccine(data)            // Create vaccine
vaccineAPI.updateVaccine(id, data)        // Update vaccine
vaccineAPI.deleteVaccine(id, reason)      // Delete vaccine
vaccineAPI.getVaccineHistory(id)          // Get vaccine history

// Dose API
doseAPI.getVaccineDoses(vaccineId)        // Get doses for vaccine
doseAPI.getDoseById(id)                   // Get single dose
doseAPI.createDose(vaccineId, data)       // Create dose
doseAPI.updateDose(id, data)              // Update dose
doseAPI.deleteDose(id)                    // Delete dose
doseAPI.calculateDueDate(...)             // Calculate due date
```

## 🎯 Usage

### Navigate to Vaccine Catalog
```
http://localhost:5173/vaccines
```

### Create a New Vaccine
1. Click "Add Vaccine" button
2. Fill in required fields:
   - Vaccine Name
   - Generic Name
   - Manufacturer
   - CVX Code (numeric)
   - Total Doses
3. Configure optional fields (storage, presentation, etc.)
4. Click "Create Vaccine"

### Create Dose Requirements
1. Select a vaccine from the list
2. Click "View All" or navigate to Dose Requirements
3. Click "Add Dose"
4. Fill dose details:
   - Dose Number
   - Minimum Age
   - Maximum Age (optional)
   - Interval from previous dose
   - Priority level
5. Add guidelines if needed
6. Click "Create Dose"

### Edit/Update Information
1. Click the Edit button on any vaccine or dose
2. Make changes to the form
3. Click "Update" button

### View History
1. Open a vaccine detail
2. Click "View History" button
3. See all versions and updates

## 🛠️ Configuration

### Environment Variables
Create a `.env.local` file in the Frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`

## 📦 Dependencies

Required npm packages:
- `react` - UI library
- `react-router-dom` - Routing
- `react-toastify` - Toast notifications
- `lucide-react` - Icon library

Install with:
```bash
npm install react-router-dom react-toastify lucide-react
```

## 🎨 Styling

The frontend uses:
- **Tailwind CSS** for utility-first styling
- **Responsive Design** that works on desktop, tablet, and mobile
- **Color System**:
  - Blue: Primary actions
  - Green: Active/Success status
  - Red: Delete/Danger actions
  - Orange: Superseded/Warnings
  - Yellow: Pending status
  - Purple: Special priority

## ✨ Features Highlight

### Smart Formvalidation
- Real-time error detection
- Required field validation
- Numeric and format validation
- Age range validation

### User Experience
- Toast notifications for actions
- Loading states
- Confirmation dialogs for destructive actions
- Empty states with helpful messages
- Breadcrumb navigation with back buttons

### Data Management
- Filter by status
- Sort by priority
- Search capabilities (can be added)
- Pagination ready (can be implemented)

## 🚀 Future Enhancements

- [ ] Search functionality for vaccines/doses
- [ ] Pagination for large lists
- [ ] Bulk actions (delete multiple, export)
- [ ] Import vaccines from CSV
- [ ] Vaccine scheduling calculator
- [ ] Print schedules
- [ ] Export to PDF
- [ ] Advanced filtering and sorting
- [ ] User permissions and roles
- [ ] Audit logging

## 📝 Example Data

### Vaccine Example
```javascript
{
  name: "COVID-19 Vaccine",
  genericName: "mRNA COVID-19 Vaccine",
  manufacturer: "Pfizer",
  cvxCode: "208",
  description: "mRNA vaccine against COVID-19",
  presentation: "vial",
  volume: { value: 1, unit: "mL" },
  storageRequirements: {
    minTemp: -80,
    maxTemp: -60,
    requiresRefrigeration: true
  },
  totalDoses: 2,
  status: "active"
}
```

### Dose Example
```javascript
{
  doseNumber: 1,
  doseName: "First Dose",
  minAge: { value: 18, unit: "years" },
  maxAge: { value: null, unit: "years" },
  intervalFromPrevious: {
    minDays: 0,
    maxDays: null,
    exactDays: null
  },
  priority: "routine",
  status: "active"
}
```

## 🤝 Integration

To integrate into your application:

```jsx
// In your main App.jsx
import VaccineCatalog from './components/VaccineCatalog/VaccineCatalog'

<Route path="/vaccines" element={<VaccineCatalog />} />
```

Or use individual components:

```jsx
import VaccineList from './components/VaccineCatalog/Vaccines/VaccineList'
import DoseList from './components/VaccineCatalog/Doses/DoseList'

// In your component
<VaccineList />
<DoseList vaccineId={vaccineId} vaccineName={name} />
```

## 📞 Support

For issues or questions:
1. Check the backend API endpoints
2. Verify environment variables are set
3. Check browser console for error messages
4. Review toast notifications for API errors

## 📄 License

This frontend is part of the UniVax project. See the main project LICENSE for details.
