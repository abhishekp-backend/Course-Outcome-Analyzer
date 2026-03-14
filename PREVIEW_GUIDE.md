# 🎨 Project Preview Guide

## 🌐 Access URLs

### Main Application (CO-PO Mapping System)
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Admin Panel (if needed)
- **Frontend**: http://localhost:5174 (or check terminal output)

---

## 📱 Application Preview

### 1. **Login Page** (`/`)
- **Design**: Modern gradient background (blue to indigo)
- **Features**:
  - Clean white card with shadow
  - "Welcome Back" heading
  - Email and password input fields
  - "Sign In" button with loading state
  - Link to signup page
  - Error message display (red alert box)

**Visual Elements**:
- Gradient background: `from-blue-50 to-indigo-100`
- White card with rounded corners and shadow
- Blue-themed buttons and links
- Responsive design

---

### 2. **Signup Page** (`/signup`)
- **Design**: Modern gradient background (green to emerald)
- **Features**:
  - "Create Account" heading
  - Form fields:
    - Username
    - Email
    - Password
    - Confirm Password
  - Password validation (minimum 6 characters, must match)
  - "Create Account" button
  - Link to login page
  - Enhanced error messages with helpful suggestions

**Visual Elements**:
- Gradient background: `from-green-50 to-emerald-100`
- Green-themed buttons and links
- Error icons with detailed messages

---

### 3. **Dashboard** (`/dashboard`) - Protected Route
- **Design**: Clean, functional interface
- **Features**:
  - **Search Functionality**:
    - Search by PRN (Permanent Registration Number)
    - Filter by Subject (dropdown)
    - Search button (red)
    - Close search button (appears after search)
    - Save button (appears when changes are made - green)
  
  - **Subject Management**:
    - "Add Teaching Subject" button (red)
    - Subject list display
    - Subject form modal
  
  - **Student Management**:
    - Student list view (when searched)
    - Student records with marks tracking
    - Assessment components:
      - Unit Tests (UT1, UT2) with CO mapping
      - Internal Assessment (IA)
      - Project Based Learning (PBL)
      - Term Work (TW)

**Layout**:
- Padding: `px-20 pt-15`
- Horizontal search bar with inputs and buttons
- Dynamic content area based on search state

---

### 4. **Subject Detail Page** (`/subject/:id`)
- Subject-specific information
- Student enrollment management
- CO-PO correlation mapping

---

## 🎨 Design System

### Color Scheme
- **Primary Blue**: `#2563eb` (blue-600)
- **Primary Green**: `#16a34a` (green-600)
- **Primary Red**: `#dc2626` (red-500/600)
- **Backgrounds**: Gradient overlays (blue/indigo, green/emerald)
- **Cards**: White with shadow-lg

### Typography
- **Headings**: Bold, large (text-3xl)
- **Body**: Medium gray (text-gray-600, text-gray-700)
- **Labels**: Small, medium weight (text-sm font-medium)

### Components
- **Buttons**: Rounded, with hover states and focus rings
- **Inputs**: Bordered, with focus rings
- **Forms**: Spaced vertically (space-y-6)
- **Alerts**: Colored backgrounds with borders

---

## 🔐 Authentication Flow

1. **Landing**: User sees login page
2. **Signup**: Click "Sign up" → Fill form → Account created → Auto-login → Redirect to dashboard
3. **Login**: Enter credentials → JWT token stored → Redirect to dashboard
4. **Protected Routes**: Automatically redirect to login if not authenticated

---

## 📊 Features Overview

### For Teachers/Faculty:
- ✅ Add and manage teaching subjects
- ✅ Search students by PRN and subject
- ✅ Record and update student marks
- ✅ Track assessment components (UT, IA, PBL, TW)
- ✅ Map Course Outcomes (CO) to Program Outcomes (PO)

### Technical Features:
- ✅ JWT Authentication
- ✅ Redux state management
- ✅ Protected routes
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS

---

## 🚀 Quick Start Preview

1. **Open Browser**: Navigate to http://localhost:5173
2. **Create Account**: Click "Sign up" and register
3. **Login**: Use your credentials to sign in
4. **Dashboard**: 
   - Add a teaching subject
   - Search for students
   - Manage student records

---

## 📸 Expected Screens

### Login Screen
```
┌─────────────────────────────────┐
│     Welcome Back                │
│  Sign in to your account        │
│                                 │
│  Email: [____________]          │
│  Password: [____________]       │
│                                 │
│     [Sign In]                   │
│                                 │
│  Don't have an account? Sign up │
└─────────────────────────────────┘
```

### Dashboard Screen
```
┌─────────────────────────────────────────────┐
│  [PRN Search] [Subject ▼] [Search] [Close] │
│                                             │
│  [Add Teaching Subject]                     │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Subject List                         │   │
│  │ - Subject 1                          │   │
│  │ - Subject 2                          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## ⚠️ Troubleshooting

If the preview doesn't load:
1. Check if servers are running:
   - Backend: `http://localhost:5000/api/health`
   - Frontend: `http://localhost:5173`
2. Ensure MongoDB is running (for backend)
3. Check browser console for errors
4. Verify `.env` file exists in Backend directory

---

## 🎯 Next Steps

1. **Test Authentication**: Create account and login
2. **Add Subject**: Use "Add Teaching Subject" button
3. **Search Students**: Enter PRN and select subject
4. **Update Marks**: Modify student assessment data
5. **Explore Features**: Navigate through all pages

---

**Enjoy exploring your CO-PO Mapping System! 🎓**

