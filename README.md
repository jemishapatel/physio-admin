# Move Well - Admin Dashboard

Modern, responsive React + TypeScript admin dashboard for managing clinic and doctor approvals.

## 🚀 Features

- ✅ **Modern UI/UX** - Beautiful gradient designs, smooth animations, responsive layout
- ✅ **Dashboard** - Overview statistics and quick actions
- ✅ **Clinic Approvals** - Review, approve, or reject clinic registrations
- ✅ **Doctor Approvals** - Review, approve, or reject doctor registrations
- ✅ **Authentication** - Secure login with JWT tokens
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **TypeScript** - Type-safe code for better development experience

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS (via inline styles)

## 🛠️ Installation

```bash
# Navigate to admin-side folder
cd admin-side

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🔧 Configuration

Create a `.env` file in the `admin-side` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
admin-side/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout with sidebar
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── pages/
│   │   ├── Dashboard.tsx       # Dashboard page
│   │   ├── ClinicApprovals.tsx # Clinic approvals page
│   │   ├── DoctorApprovals.tsx # Doctor approvals page
│   │   └── Login.tsx           # Login page
│   ├── services/
│   │   └── api.ts              # API service layer
│   ├── App.tsx                 # Main app component
│   ├── index.tsx               # Entry point
│   └── index.css               # Global styles
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Emerald/Teal gradient (#10b981 → #059669)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

### Components
- **Sidebar Navigation** - Gradient background with smooth transitions
- **Dashboard Cards** - Hover effects and statistics
- **Approval Cards** - Modern card design with action buttons
- **Modals** - Smooth animations and backdrop blur
- **Buttons** - Gradient backgrounds with hover effects

## 🔐 Authentication

The app uses JWT token-based authentication:

1. Login with admin credentials
2. Token stored in localStorage
3. Token sent with every API request
4. Auto-redirect to login on 401 errors

### Demo Credentials
```
Email: admin@movewell.com
Password: admin123
```

## 📡 API Integration

The app connects to the backend API at `http://localhost:5000/api`

### Required Backend Endpoints

#### Clinic APIs
- `GET /api/clinic` - Get all clinics
- `GET /api/clinic/pending` - Get pending clinics
- `PUT /api/clinic/:id/approve` - Approve clinic
- `PUT /api/clinic/:id/reject` - Reject clinic

#### Doctor APIs
- `GET /api/doctor` - Get all doctors
- `GET /api/doctor/pending` - Get pending doctors
- `PUT /api/doctor/:id/approve` - Approve doctor
- `PUT /api/doctor/:id/reject` - Reject doctor

#### Dashboard APIs
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/activity` - Get recent activity

## 🎯 Usage

### 1. Login
- Navigate to `/login`
- Enter admin credentials
- Click "Sign In"

### 2. Dashboard
- View statistics (total clinics, doctors, users)
- See pending approvals count
- Quick access to approval pages
- Recent activity feed

### 3. Clinic Approvals
- View all clinics or filter by status (pending/approved/rejected)
- Click "Approve" or "Reject" buttons
- Provide rejection reason if rejecting
- Confirm action in modal

### 4. Doctor Approvals
- View all doctors or filter by status
- See doctor details (specialization, experience, clinic)
- Approve or reject with reason
- Confirm action in modal

## 🚀 Build for Production

```bash
# Create production build
npm run build

# The build folder will contain optimized files
```

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop** (1024px+): Full sidebar, multi-column layouts
- **Tablet** (768px-1023px): Collapsible sidebar, 2-column layouts
- **Mobile** (<768px): Hidden sidebar (toggle button), single-column layouts

## 🎨 Customization

### Colors
Edit the gradient colors in components:
```tsx
// Primary gradient
className="bg-gradient-to-r from-emerald-500 to-teal-600"

// Change to your brand colors
className="bg-gradient-to-r from-blue-500 to-purple-600"
```

### Logo
Replace the emoji logo in `Layout.tsx` and `Login.tsx`:
```tsx
<span className="text-5xl">🏥</span>
// Replace with your logo image
<img src="/logo.png" alt="Logo" />
```

## 🐛 Troubleshooting

### API Connection Issues
- Check if backend server is running on `http://localhost:5000`
- Verify CORS is enabled on backend
- Check `.env` file has correct API URL

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check token expiration
- Verify backend JWT secret matches

### Build Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## 📄 License

This project is part of the Move Well platform.

## 🤝 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for Move Well Platform**
