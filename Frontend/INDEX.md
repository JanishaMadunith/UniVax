# 📚 Vaccine Catalog Frontend - Complete Documentation

Welcome to the UniVax Vaccine Catalog Frontend! This comprehensive guide will help you understand, set up, and use all the vaccine and dose management features.

## 📖 Documentation Files

### 🚀 Getting Started
- **[QUICKSTART.md](./QUICKSTART.md)** - Start here! 60-second setup and basic usage
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed installation and configuration
- **[README.md](./src/components/VaccineCatalog/README.md)** - Complete component documentation

### 🔌 API Integration
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API endpoints reference
- Backend routes and data models
- Example workflows and cURL commands

## 🎯 Quick Navigation

### I want to...
- **[Start immediately](./QUICKSTART.md)** → Read QUICKSTART.md
- **[Set up the project](./SETUP_GUIDE.md)** → Read SETUP_GUIDE.md
- **[Understand the components](./src/components/VaccineCatalog/README.md)** → Read component README
- **[Use the API](./API_REFERENCE.md)** → Read API_REFERENCE.md
- **[Troubleshoot issues](./SETUP_GUIDE.md#troubleshooting)** → Check SETUP_GUIDE.md

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── Signup.jsx
│   │   └── VaccineCatalog/              ← Main feature
│   │       ├── VaccineCatalog.jsx       ← Entry component
│   │       ├── index.js                 ← Exports
│   │       ├── README.md                ← Component docs
│   │       ├── Vaccines/
│   │       │   ├── VaccineList.jsx
│   │       │   ├── VaccineForm.jsx
│   │       │   └── VaccineDetail.jsx
│   │       └── Doses/
│   │           ├── DoseList.jsx
│   │           ├── DoseForm.jsx
│   │           └── DoseDetail.jsx
│   ├── services/
│   │   └── api.js                       ← API integration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── QUICKSTART.md                        ← Quick start guide
├── SETUP_GUIDE.md                       ← Installation guide
├── API_REFERENCE.md                     ← API documentation
├── INDEX.md                             ← This file
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Features Overview

### Vaccine Management
✅ Create vaccines with full details
✅ Edit and update vaccine information
✅ Delete vaccines (soft delete)
✅ View vaccine history and versions
✅ Filter vaccines by status
✅ Track storage requirements
✅ Manage contraindications
✅ Track approved regions

### Dose Management
✅ Create dose requirements for vaccines
✅ Configure age requirements
✅ Set interval requirements
✅ Define priority levels
✅ Manage vaccination guidelines
✅ Edit and update dose schedules
✅ Delete dose requirements
✅ Filter doses by status

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
cd Frontend
npm install

# 2. Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:5173/vaccines

# 5. Build for production
npm run build
```

## 🔧 Prerequisites

- Node.js 14+ (`node --version`)
- npm or yarn
- Backend running on `http://localhost:5000`
- Backend API endpoints properly configured

## 📚 Component Hierarchy

```
VaccineCatalog
├── Tab: Vaccines
│   ├── VaccineList
│   │   ├── VaccineForm (when creating/editing)
│   │   └── VaccineDetail (when viewing)
│   │       └── DoseList embedded
└── Tab: Doses
    ├── DoseList
    │   ├── DoseForm (when creating/editing)
    │   └── DoseDetail (when viewing)
```

## 🎯 Main Components

### VaccineCatalog
**Purpose**: Main entry component with tab navigation
**File**: `src/components/VaccineCatalog/VaccineCatalog.jsx`
**Usage**: 
```jsx
<Route path="/vaccines" element={<VaccineCatalog />} />
```

### VaccineList
**Purpose**: Display and manage vaccines
**File**: `src/components/VaccineCatalog/Vaccines/VaccineList.jsx`
**Features**: Filter, create, edit, delete, view details

### VaccineForm
**Purpose**: Create/edit vaccine forms
**File**: `src/components/VaccineCatalog/Vaccines/VaccineForm.jsx`
**Features**: Full validation, storage configuration, version control

### VaccineDetail
**Purpose**: View vaccine details and associated doses
**File**: `src/components/VaccineCatalog/Vaccines/VaccineDetail.jsx`
**Features**: History view, dose link, contraindications

### DoseList
**Purpose**: Display and manage dose requirements
**File**: `src/components/VaccineCatalog/Doses/DoseList.jsx`
**Features**: Filter, create, edit, delete, view details

### DoseForm
**Purpose**: Create/edit dose forms
**File**: `src/components/VaccineCatalog/Doses/DoseForm.jsx`
**Features**: Age/interval config, guideline management, validation

### DoseDetail
**Purpose**: View dose details
**File**: `src/components/VaccineCatalog/Doses/DoseDetail.jsx`
**Features**: Age requirements, intervals, guidelines, version info

## 🔌 API Service

**File**: `src/services/api.js`

**Vaccine Methods**:
```javascript
vaccineAPI.getAllVaccines(filters)
vaccineAPI.getVaccineById(id)
vaccineAPI.createVaccine(data)
vaccineAPI.updateVaccine(id, data)
vaccineAPI.deleteVaccine(id, reason)
vaccineAPI.getVaccineHistory(id)
```

**Dose Methods**:
```javascript
doseAPI.getVaccineDoses(vaccineId)
doseAPI.getDoseById(id)
doseAPI.createDose(vaccineId, data)
doseAPI.updateDose(id, data)
doseAPI.deleteDose(id)
doseAPI.calculateDueDate(...)
```

## 📋 Data Models

### Vaccine
```javascript
{
  name: string,              // Vaccine name
  genericName: string,       // Generic/scientific name
  manufacturer: string,      // Manufacturer name
  cvxCode: string,          // Numeric CVX code
  description: string,       // Optional description
  presentation: string,      // vial | prefilled syringe | nasal spray | oral
  volume: { value, unit },  // Volume measurement
  storageRequirements: {     // Storage info
    minTemp: number,
    maxTemp: number,
    requiresRefrigeration: boolean
  },
  totalDoses: number,        // Number of doses in series
  status: string,            // active | discontinued | pending | archived
  version: number,           // Version number
  updateReason: string       // Reason for update
}
```

### Dose
```javascript
{
  doseNumber: number,        // Dose sequence
  doseName: string,          // Human-readable name
  minAge: { value, unit },  // Minimum age requirement
  maxAge: { value, unit },  // Maximum age (optional)
  intervalFromPrevious: {    // Interval config
    minDays: number,
    maxDays: number,
    exactDays: number
  },
  allowableDelay: number,    // Grace period in days
  priority: string,          // routine | catchup | special
  status: string,            // active | superseded | pending
  guidelines: [{             // Vaccination guidelines
    authority: string,
    reference: string,
    url: string
  }]
}
```

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Responsive**: Mobile-first design
- **Color Scheme**:
  - Blue: Primary actions
  - Green: Active/Success
  - Red: Delete/Danger
  - Orange: Warnings/Superseded
  - Yellow: Pending
  - Purple: Special

## 📱 Responsive Breakpoints
- **Mobile**: < 640px (single column)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: > 1024px (3+ columns)

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Failed to load vaccines" | Check backend running, verify API URL |
| No toast notifications | Verify react-toastify installed |
| Styles not showing | Check Tailwind CSS imports |
| Cannot edit vaccine | Verify vaccine ID, check network tab |
| CORS errors | Enable CORS in backend |

See [SETUP_GUIDE.md#troubleshooting](./SETUP_GUIDE.md#troubleshooting) for more.

## 🔐 Security Checklist

- [ ] Never commit `.env.local`
- [ ] Validate all user input
- [ ] Implement authentication
- [ ] Use HTTPS in production
- [ ] Add authorization checks
- [ ] Sanitize user input
- [ ] Handle errors gracefully

## 📊 Performance Tips

1. Use React.memo for heavy components
2. Implement pagination for large lists
3. Lazy load routes
4. Optimize images and assets
5. Use database indexes
6. Cache API responses
7. Debounce search inputs

## 🚀 Deployment Options

- **Vercel**: Automatic deployments from GitHub
- **Netlify**: Drag & drop or GitHub integration
- **Docker**: Containerized deployment
- **Traditional Server**: Build and serve static files

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contributing

When adding new features:
1. Follow existing code patterns
2. Use TypeScript where possible
3. Add error handling
4. Include loading states
5. Test thoroughly
6. Update documentation
7. Follow commit conventions

## 📞 Support & Help

1. **Start with**: [QUICKSTART.md](./QUICKSTART.md)
2. **Setup help**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
3. **Component docs**: [README.md](./src/components/VaccineCatalog/README.md)
4. **API help**: [API_REFERENCE.md](./API_REFERENCE.md)
5. **Check browser console** for error details

## ✅ Verification Checklist

Before deploying:
- [ ] Backend API running and accessible
- [ ] Environment variables configured
- [ ] All dependencies installed
- [ ] No console errors
- [ ] All CRUD operations working
- [ ] Responsive design tested
- [ ] Forms validating correctly
- [ ] Toast notifications showing
- [ ] Error handling working
- [ ] Build completes without errors

## 📈 Version History

Version 1.0.0 (2024)
- Initial release
- Vaccine management
- Dose management
- API integration
- Comprehensive documentation

## 📄 License

This frontend is part of the UniVax project. See the main project LICENSE for details.

## 🎉 You're All Set!

You now have everything you need to:
✅ Set up the vaccine catalog frontend
✅ Manage vaccines and doses
✅ Integrate with the backend API
✅ Deploy to production
✅ Extend and customize

**Next Steps**:
1. Read [QUICKSTART.md](./QUICKSTART.md)
2. Run `npm install`
3. Create `.env.local`
4. Start with `npm run dev`
5. Navigate to `/vaccines`

Happy coding! 🚀

---

**Last Updated**: January 2024
**Version**: 1.0.0
