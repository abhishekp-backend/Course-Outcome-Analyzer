# MERN Stack Authentication App with Redux

A complete authentication system built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring login and signup functionality with JWT authentication and centralized state management using Redux Toolkit.

## Features

- ✅ User registration with validation
- ✅ User login with JWT authentication
- ✅ Protected routes with Redux state management
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Form validation and error handling
- ✅ Secure password hashing with bcrypt
- ✅ MongoDB database integration
- ✅ Dashboard with user information
- ✅ **Redux Toolkit for centralized state management**
- ✅ **Custom hooks for easy Redux integration**
- ✅ **Protected routes with Redux authentication**
- ✅ **Persistent authentication state**

## Project Structure

```
College Project/
├── Backend/                 # Express.js server
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables (create this)
└── CO - PO/               # React frontend
    ├── src/
    │   ├── Components/
    │   │   ├── Authentication/
    │   │   │   ├── Login.jsx
    │   │   │   └── Signup.jsx
    │   │   └── Dashboard/
    │   │       └── Dashboard.jsx/
    │   │           └── index.jsx
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── store/
    │   │   ├── index.js
    │   │   └── slices/
    │   │       └── authSlice.js
    │   ├── utils/
    │   │   └── logger.js
    │   └── App.jsx
    └── package.json
```

## Redux State Management

### Store Structure
```javascript
{
  auth: {
    user: null | { id, username, email },
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  }
}
```

### Key Redux Features
- **Redux Toolkit**: Modern Redux with simplified setup
- **Async Thunks**: Handle API calls with loading states
- **Custom Hooks**: `useAuth()` for easy state access
- **Persistent State**: Authentication state persists across page reloads
- **Protected Routes**: Automatic redirection based on auth state
- **Error Handling**: Centralized error management

### Available Actions
- `loginUser(credentials)` - Login with email/password
- `registerUser(userData)` - Register new user
- `logoutUser()` - Logout and clear state
- `checkAuthStatus()` - Verify token validity
- `clearError()` - Clear error messages

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a .env file in the Backend directory:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-auth
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start MongoDB:**
   - If using local MongoDB, make sure the service is running
   - If using MongoDB Atlas, replace the MONGODB_URI with your connection string

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd "CO - PO"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## Redux Integration

### Store Configuration
The Redux store is configured in `src/store/index.js` with:
- Authentication slice for user management
- Redux DevTools for debugging
- Custom middleware for serialization

### Authentication Slice
Located in `src/store/slices/authSlice.js`:
- Async thunks for API calls
- Loading states for better UX
- Error handling and state management
- Token persistence in localStorage

### Custom Hook
`useAuth()` hook provides:
- Easy access to auth state
- Login/register/logout functions
- Loading and error states
- Automatic token verification

### Protected Routes
`ProtectedRoute` component:
- Checks authentication status
- Redirects unauthenticated users
- Shows loading states
- Integrates with Redux state

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`

- `POST /api/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`

- `GET /api/profile` - Get user profile (protected route)
  - Headers: `Authorization: Bearer <token>`

- `GET /api/health` - Health check endpoint

## Usage

1. **Start both servers** (backend and frontend)
2. **Open your browser** and navigate to `http://localhost:5173`
3. **Create an account** using the signup form
4. **Login** with your credentials
5. **Access the dashboard** to see your user information
6. **Check Redux DevTools** (F12 → Redux tab) to see state changes

## Redux State Flow

### Login Flow
1. User submits login form
2. `loginUser` thunk dispatched
3. API call to backend
4. Token stored in localStorage
5. User data stored in Redux state
6. `isAuthenticated` set to true
7. Automatic redirect to dashboard

### Registration Flow
1. User submits registration form
2. `registerUser` thunk dispatched
3. API call to backend
4. Token stored in localStorage
5. User data stored in Redux state
6. `isAuthenticated` set to true
7. Automatic redirect to dashboard

### Logout Flow
1. User clicks logout
2. `logoutUser` thunk dispatched
3. Token removed from localStorage
4. Redux state cleared
5. `isAuthenticated` set to false
6. Redirect to login page

## Features Explained

### Backend Features

- **Express.js Server**: RESTful API with middleware for CORS and JSON parsing
- **MongoDB Integration**: User data stored in MongoDB with Mongoose ODM
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Server-side validation for user inputs
- **Error Handling**: Comprehensive error handling and responses

### Frontend Features

- **React Router**: Client-side routing between pages
- **Redux Toolkit**: Centralized state management
- **Custom Hooks**: Easy access to Redux state
- **Responsive Design**: Tailwind CSS for modern, responsive UI
- **Form Validation**: Client-side validation with error messages
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Persistent State**: Authentication state persists across sessions

### Redux Features

- **Centralized State**: All auth state in one place
- **Async Operations**: Handle API calls with loading states
- **Error Management**: Centralized error handling
- **DevTools Integration**: Debug state changes easily
- **Type Safety**: Better development experience
- **Performance**: Optimized re-renders

### Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **CORS**: Cross-origin resource sharing configuration
- **Input Sanitization**: Server-side validation
- **Protected Routes**: Authentication middleware
- **Token Verification**: Automatic token validation

## Development

### Redux DevTools
Install Redux DevTools browser extension for debugging:
- Chrome: Redux DevTools
- Firefox: Redux DevTools

### Adding New Redux Features

1. **New Slices**: Create in `src/store/slices/`
2. **New Hooks**: Create custom hooks in `src/hooks/`
3. **New Actions**: Add to existing slices or create new ones
4. **State Updates**: Use Redux Toolkit's immer integration

### Environment Variables

Create a `.env` file in the Backend directory with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-auth
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Troubleshooting

### Common Issues

1. **Redux State Not Updating**
   - Check Redux DevTools for action dispatch
   - Verify reducer is handling actions correctly
   - Check for serialization errors

2. **Authentication State Lost**
   - Verify localStorage has token
   - Check `checkAuthStatus` thunk
   - Ensure token is valid

3. **Protected Routes Not Working**
   - Check `isAuthenticated` state
   - Verify `ProtectedRoute` component
   - Check Redux state in DevTools

4. **API Calls Failing**
   - Check backend server is running
   - Verify CORS configuration
   - Check network tab for errors

## License

This project is open source and available under the [MIT License](LICENSE). 