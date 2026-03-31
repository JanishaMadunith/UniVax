# Quick Start Guide - Vaccine Catalog Frontend

## ✨ 60-Second Setup

### 1. Prerequisites
```bash
# Make sure you have Node.js 14+ installed
node --version

# Install dependencies
cd Frontend
npm install
```

### 2. Configure Backend URL
Create `Frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the App
```bash
npm run dev
```

Visit: `http://localhost:5173/vaccines`

---

## 🎯 What You Can Do

### ✅ Vaccine Management
- ✨ Create new vaccines with full details
- 📝 Edit existing vaccines
- 🗑️ Delete vaccines
- 📊 View vaccine history/versions
- 🔍 Filter vaccines by status

### ✅ Dose Management
- ✨ Create dose requirements for vaccines
- 📝 Edit dose schedules
- 🗑️ Remove dose requirements
- 📋 View age and interval requirements
- 📚 Manage vaccination guidelines

---

## 🚀 Getting Started

### Step 1: Navigate to Vaccines
```
http://localhost:5173/vaccines
```

### Step 2: Create Your First Vaccine
1. Click **"Add Vaccine"** button
2. Fill in required information:
   - **Vaccine Name**: e.g., "COVID-19 Vaccine"
   - **Generic Name**: e.g., "mRNA COVID-19 Vaccine"
   - **Manufacturer**: e.g., "Pfizer"
   - **CVX Code**: e.g., "208" (numeric)
   - **Total Doses**: e.g., "2"
3. Click **"Create Vaccine"**

### Step 3: Add Dose Requirements
1. Click on a vaccine to view details
2. Click **"View All"** in Dose Requirements section
3. Click **"Add Dose"**
4. Fill in dose information:
   - **Dose Number**: e.g., "1"
   - **Minimum Age**: e.g., "18 years"
   - **Priority**: "routine", "catchup", or "special"
5. Click **"Create Dose"**

### Step 4: Manage Your Data
- **Edit**: Click the ✏️ edit button
- **Delete**: Click the 🗑️ delete button
- **View Details**: Click on a vaccine or dose to see full information
- **Filter**: Use status buttons to filter vaccines/doses

---

## 📚 Component Usage Examples

### Using the Main Component
```jsx
import VaccineCatalog from './components/VaccineCatalog/VaccineCatalog'

// In your app routing
<Route path="/vaccines" element={<VaccineCatalog />} />
```

### Using Individual Components
```jsx
import { VaccineList, DoseList } from './components/VaccineCatalog'

// Vaccine list
<VaccineList />

// Dose list for a vaccine
<DoseList 
  vaccineId="123abc" 
  vaccineName="COVID-19 Vaccine"
  onBack={() => console.log('Go back')}
/>
```

### Using the API Service
```jsx
import { vaccineAPI, doseAPI } from './services/api'

// Get all vaccines
const vaccines = await vaccineAPI.getAllVaccines()

// Create vaccine
const newVaccine = await vaccineAPI.createVaccine({
  name: "New Vaccine",
  genericName: "Generic Name",
  manufacturer: "Manufacturer",
  cvxCode: "123",
  totalDoses: 2
})

// Get doses for a vaccine
const doses = await doseAPI.getVaccineDoses(vaccineId)

// Create dose
const newDose = await doseAPI.createDose(vaccineId, {
  doseNumber: 1,
  minAge: { value: 18, unit: "years" },
  priority: "routine"
})
```

---

## 🎨 Component Structure

```
VaccineCatalog (Main)
├── VaccineList
│   ├── VaccineDetail
│   └── VaccineForm
└── DoseList
    ├── DoseDetail
    └── DoseForm
```

### Component Responsibilities

**VaccineList**
- Display all vaccines
- Filter by status
- Quick actions (edit, delete)
- Navigate to vaccine details

**VaccineForm**
- Create new vaccines
- Edit existing vaccines
- Form validation
- Storage configuration

**VaccineDetail**
- Show vaccine information
- Display dose requirements
- View vaccine history
- Show contraindications

**DoseList**
- Display doses for a vaccine
- Filter doses by status
- Quick actions (edit, delete)
- Navigate to dose details

**DoseForm**
- Create new doses
- Edit existing doses
- Configure age requirements
- Manage guidelines

**DoseDetail**
- Show dose information
- Display age requirements
- Show interval details
- Display guidelines

---

## 🔧 Key Features

### 🎯 Status Management
Vaccines:
- `active` - Currently available
- `discontinued` - No longer used
- `pending` - Not yet approved
- `archived` - Historical records

Doses:
- `active` - Currently in use
- `superseded` - Replaced by newer dose
- `pending` - Not yet approved

### 📊 Priority Levels
- `routine` - Regular immunization
- `catchup` - Catch-up schedule
- `special` - Special circumstances

### 📐 Age Requirements
Set minimum and maximum ages for:
- Days
- Weeks
- Months
- Years

### ⏱️ Interval Requirements
Configure intervals between doses:
- Minimum days
- Maximum days
- Exact days
- Allowable delay

---

## 🐛 Troubleshooting

### Issue: "Failed to load vaccines"
**Solution:**
- Start the backend server
- Check `VITE_API_URL` in `.env.local`
- Check browser console for errors

### Issue: No toast notifications
**Solution:**
- Verify `react-toastify` is installed
- Check if notifications container is in App.jsx

### Issue: Styles not showing
**Solution:**
- Verify Tailwind CSS is installed
- Check `index.css` has @tailwind directives

### Issue: Cannot edit vaccine
**Solution:**
- Check if vaccine ID is correct
- Verify backend returns vaccine data properly
- Check network tab in browser

---

## 📱 Responsive Design

The frontend is fully responsive:
- **Desktop**: Full layout with all features
- **Tablet**: Adjusted grid layouts
- **Mobile**: Single column layout

---

## 🔐 Security Notes

- Never commit `.env.local` with sensitive data
- Validate all user input on frontend
- Implement proper authentication
- Use HTTPS in production
- Add authorization checks for operations

---

## 📦 Built With

- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icons
- **React Toastify** - Notifications
- **Vite** - Build tool

---

## 🎓 Learning Resources

Check individual component READMEs:
```
Frontend/src/components/VaccineCatalog/README.md         # Full documentation
Frontend/SETUP_GUIDE.md                                  # Detailed setup
```

---

## 💡 Tips & Tricks

### Keyboard Navigation
- `Enter` - Submit form
- `Escape` - Close modals (when implemented)
- `Tab` - Navigate fields

### Efficient Workflow
1. Create all vaccines first
2. Then add dose requirements
3. Use filters to organize large lists
4. Keep descriptions concise

### Data Management
- Use CVX codes for standardization
- Follow your country's guidelines
- Document update reasons
- Maintain version history

---

## 📞 Need Help?

1. Check browser console for errors
2. Review network requests in DevTools
3. Read component READMEs
4. Check backend API endpoints
5. Verify environment configuration

---

## ✅ Validation Rules

### Vaccine
- ✅ Name: 2+ characters
- ✅ Generic Name: Required
- ✅ Manufacturer: Required
- ✅ CVX Code: Numeric only
- ✅ Total Doses: ≥ 1

### Dose
- ✅ Dose Number: ≥ 1
- ✅ Min Age: Required, ≥ 0
- ✅ Max Age: ≥ Min Age (if set)
- ✅ At least one age unit

---

## 🎉 You're Ready!

Start creating vaccines and doses now:
1. ✅ Backend running
2. ✅ Frontend installed
3. ✅ Environment configured
4. ✅ Visit `/vaccines` page

Happy immunizing! 💉
