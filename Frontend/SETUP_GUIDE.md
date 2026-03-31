# Frontend Setup & Configuration Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Frontend dependencies installed

## Installation & Setup

### 1. Install Dependencies

Navigate to the Frontend directory and install required packages:

```bash
cd Frontend
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the `Frontend` directory:

```bash
# .env.local
VITE_API_URL=http://localhost:5000/api
```

### 3. Update Tailwind Configuration (if needed)

Ensure `tailwind.config.js` includes the components directory:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Ensure React Router is Installed

```bash
npm install react-router-dom
```

### 5. Install Toast Notifications

```bash
npm install react-toastify
```

### 6. Install Icon Library

```bash
npm install lucide-react
```

## Running the Frontend

### Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Folder Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── Signup.jsx
│   │   └── VaccineCatalog/
│   │       ├── index.js
│   │       ├── README.md
│   │       ├── VaccineCatalog.jsx
│   │       ├── Vaccines/
│   │       │   ├── VaccineList.jsx
│   │       │   ├── VaccineForm.jsx
│   │       │   └── VaccineDetail.jsx
│   │       └── Doses/
│   │           ├── DoseList.jsx
│   │           ├── DoseForm.jsx
│   │           └── DoseDetail.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Backend Integration

Ensure the backend is running on `http://localhost:5000` OR update `VITE_API_URL` in `.env.local`.

### Required Backend Routes

**Vaccine Routes:**
```
GET    /api/vaccines
GET    /api/vaccines/:id
POST   /api/vaccines
PUT    /api/vaccines/:id
DELETE /api/vaccines/:id
GET    /api/vaccines/:id/history
```

**Dose Routes:**
```
GET    /api/doses/vaccine/:vaccineId
GET    /api/doses/:id
POST   /api/doses/vaccine/:vaccineId
PUT    /api/doses/:id
DELETE /api/doses/:id
POST   /api/doses/calculate
```

## Usage

### Access the Vaccine Catalog

1. Start the frontend: `npm run dev`
2. Navigate to: `http://localhost:5173/vaccines`
3. Or use the authentication flow if your app redirects from the home page

### Key URLs

```
/                    # Home/Authentication
/vaccines            # Vaccine Catalog (Main)
```

## Troubleshooting

### 1. "Failed to load vaccines" Error
- Check if backend is running on `http://localhost:5000`
- Verify `VITE_API_URL` in `.env.local`
- Check browser console for detailed error messages

### 2. CORS Issues
The backend should have CORS enabled. In `Backend/server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

### 3. Toast Notifications Not Showing
Ensure `react-toastify` is installed and imported in components:
```bash
npm install react-toastify
```

### 4. Styles Not Applying
- Verify Tailwind CSS is properly installed
- Check that `index.css` imports Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. API Calls Returning 401
- Ensure authentication middleware is not blocking vaccine/dose routes (if they're public)
- Or ensure you're passing authentication tokens in the API service headers

## Extending the Frontend

### Adding Authentication Headers

Update `src/services/api.js`:

```javascript
const makeRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken'); // Get from your auth system
  
  return fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });
};
```

### Adding Search Functionality

Modify `VaccineList.jsx` to include:

```javascript
const [searchTerm, setSearchTerm] = useState('');

const filteredVaccines = vaccines.filter(v =>
  v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  v.genericName.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Adding Pagination

Update API service to support pagination:

```javascript
getAllVaccines: async (filters = {}, page = 1, limit = 10) => {
  const queryParams = new URLSearchParams({
    ...filters,
    page,
    limit
  });
  return makeRequest(`/vaccines?${queryParams}`);
}
```

## Performance Optimization

### 1. Lazy Loading Components

```javascript
import { lazy, Suspense } from 'react';

const VaccineList = lazy(() => import('./Vaccines/VaccineList'));

// Usage
<Suspense fallback={<div>Loading...</div>}>
  <VaccineList />
</Suspense>
```

### 2. Memoization

Use `React.memo()` for components that don't need frequent re-renders:

```javascript
export default React.memo(VaccineDetail);
```

### 3. useCallback Optimization

```javascript
const handleDelete = useCallback(async (id) => {
  // delete logic
}, [vaccines]);
```

## Deployment

### Deploy to Vercel

1. Create a Vercel account
2. Connect your GitHub repository
3. Set environment variables in Vercel dashboard
4. Deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:

```bash
docker build -t univax-frontend .
docker run -p 3000:3000 univax-frontend
```

## Best Practices

1. **Always validate user input** before sending to API
2. **Handle errors gracefully** with meaningful toast messages
3. **Use loading states** for long-running operations
4. **Confirm destructive actions** with modal dialogs
5. **Test API integration** thoroughly before deployment
6. **Keep components reusable** and follow single responsibility principle
7. **Use environment variables** for configuration
8. **Monitor console errors** during development

## Additional Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [Lucide Icons](https://lucide.dev)
- [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

## Support & Debugging

### Enable Debug Logging

Add to `api.js`:

```javascript
const makeRequest = async (endpoint, options = {}) => {
  console.log(`[API] ${options.method || 'GET'} ${endpoint}`);
  // ... rest of function
}
```

### Check Network Requests

Use browser DevTools:
1. Open Network tab
2. Look for API requests
3. Check response status and data

### Common Issues Checklist

- [ ] Backend is running
- [ ] API URL is correct in `.env.local`
- [ ] CORS is enabled on backend
- [ ] All dependencies are installed
- [ ] No console errors
- [ ] Network requests show correct status codes
