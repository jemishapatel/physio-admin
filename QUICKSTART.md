# Admin Dashboard - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running on http://localhost:5000

### Installation

1. **Navigate to admin-side folder**
```bash
cd admin-side
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file (or use the existing one):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm start
```

The app will open at http://localhost:3000

---

## 🎨 Features

### 1. Login Page
- Modern animated blob background
- Gradient card design
- Email and password authentication
- Remember me functionality
- Responsive design

**Default Admin Credentials:**
- Email: admin@movewell.com
- Password: (Check with backend team)

### 2. Dashboard
- Statistics cards showing:
  - Total clinics
  - Pending approvals
  - Total doctors
  - Active users
- Quick action buttons
- Modern gradient design

### 3. Clinic Approvals
- View all pending clinic registrations
- Filter by approval status (All, Pending, Approved, Rejected)
- Search by clinic name
- Approve/Reject actions with reason
- View clinic details
- Pagination support

### 4. Doctor Approvals
- View all pending doctor join requests
- Filter by approval status
- Search by doctor name
- Approve/Reject actions
- View doctor details
- Pagination support

---

## 🛠️ Troubleshooting

### Issue: Tailwind CSS not working
**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Restart the server
npm start
```

### Issue: API connection errors
**Solution:**
1. Check if backend is running on http://localhost:5000
2. Verify `.env` file has correct `REACT_APP_API_URL`
3. Check browser console for CORS errors
4. Ensure backend has CORS enabled for http://localhost:3000

### Issue: Login not working
**Solution:**
1. Check network tab in browser dev tools
2. Verify API endpoint is correct
3. Check if admin user exists in database
4. Verify JWT token is being stored in localStorage

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

---

## 📁 Project Structure

```
admin-side/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Sidebar navigation layout
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── pages/
│   │   ├── Login.tsx           # Login page
│   │   ├── Dashboard.tsx       # Dashboard page
│   │   ├── ClinicApprovals.tsx # Clinic approvals page
│   │   └── DoctorApprovals.tsx # Doctor approvals page
│   ├── services/
│   │   └── api.ts              # API service layer
│   ├── App.tsx                 # Main app component
│   ├── index.tsx               # Entry point
│   └── index.css               # Global styles + Tailwind
├── .env                        # Environment variables
├── .env.example                # Environment variables template
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 🎯 API Endpoints Used

### Authentication
- `POST /api/admin/login` - Admin login

### Clinics
- `GET /api/clinic/all?isApproved=pending` - Get pending clinics
- `PUT /api/clinic/:id/approve` - Approve clinic
- `PUT /api/clinic/:id/reject` - Reject clinic

### Doctors
- `GET /api/doctor/pending-approvals` - Get pending doctor approvals
- `PUT /api/doctor/:id/approve` - Approve doctor
- `PUT /api/doctor/:id/reject` - Reject doctor

### Statistics
- `GET /api/admin/stats` - Get dashboard statistics

---

## 🎨 UI Components

### Color Scheme
- **Primary:** Blue gradient (#3b82f6 to #2563eb)
- **Success:** Green gradient (#10b981 to #059669)
- **Warning:** Orange gradient (#f59e0b to #d97706)
- **Danger:** Red gradient (#ef4444 to #dc2626)
- **Background:** Light gray (#f8fafc)

### Button Styles
- **Primary:** Blue gradient with shadow
- **Success:** Green gradient with shadow
- **Danger:** Red gradient with shadow
- **Pill Shape:** 50px border-radius
- **Hover Effect:** Lift up with enhanced shadow

### Card Styles
- **Background:** White with shadow
- **Border Radius:** 12px
- **Padding:** 24px
- **Hover Effect:** Enhanced shadow

---

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- ✅ Desktop (1920px and above)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1366px)
- ✅ Mobile (320px - 768px)

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🔒 Security

### Authentication
- JWT token stored in localStorage
- Token sent in Authorization header
- Auto-logout on token expiration
- Protected routes with AuthContext

### Best Practices
- Never commit `.env` file
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize data before displaying
- Use HTTPS in production

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy to Server
1. Upload `build/` folder to your server
2. Configure web server (Nginx, Apache, etc.)
3. Update `.env` with production API URL
4. Enable HTTPS
5. Configure CORS on backend

### Environment Variables for Production
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

---

## 📝 Development Tips

### Hot Reload
The development server supports hot reload. Changes to files will automatically refresh the browser.

### TypeScript
All components are written in TypeScript for type safety. Use proper types for all props and state.

### Tailwind CSS
Use Tailwind utility classes for styling. Avoid custom CSS unless necessary.

### Code Formatting
```bash
# Format code (if prettier is installed)
npm run format

# Lint code (if eslint is installed)
npm run lint
```

---

## 🐛 Known Issues

1. **Tailwind CSS v4 Incompatibility**
   - Fixed by downgrading to v3.4.1
   - Do not upgrade to v4 without updating configuration

2. **CORS Errors**
   - Ensure backend has CORS enabled
   - Check if API URL is correct in `.env`

3. **Token Expiration**
   - Tokens expire after 7 days
   - User must login again after expiration

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review browser console for errors
3. Check network tab for API errors
4. Contact development team

---

## 🎉 Next Steps

After setup:
1. ✅ Test login functionality
2. ✅ Test clinic approval workflow
3. ✅ Test doctor approval workflow
4. ✅ Test search and filters
5. ✅ Test pagination
6. ✅ Test responsive design
7. ✅ Connect to production API
8. ✅ Deploy to production

---

**Version:** 1.0.0  
**Last Updated:** May 18, 2026  
**Status:** Ready for Testing
