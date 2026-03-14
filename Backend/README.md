# MERN Backend API

A production-ready Node.js/Express backend with MongoDB for a college management system, featuring authentication, validation, security, proper error handling, and endpoints for managing students and subjects.

## 🚀 Features

- **Authentication System**: JWT-based authentication with secure password hashing
- **Student Management**: CRUD operations for student records with validation
- **Subject Management**: Create, read, update, and delete subject information
- **Excel Upload**: Support for uploading student data via Excel files
- **Input Validation**: Comprehensive validation using express-validator
- **Security**: Helmet, CORS, rate limiting, and payload size limits
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Database**: MongoDB with Mongoose ODM
- **Logging**: Morgan HTTP request logging
- **Environment Configuration**: Environment-based configuration
- **Modular Architecture**: Clean separation of concerns

## 📁 Project Structure

```
src/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── authController.js    # Authentication business logic
│   ├── studentController.js # Student management logic
│   └── subjectController.js # Subject management logic
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── errorHandler.js     # Error handling
│   ├── security.js         # Security middleware
│   └── validation.js       # Input validation
├── models/
│   ├── MapStudentAndSubject.js # Mapping between students and subjects
│   ├── MapUserAndSubject.js    # Mapping between users and subjects
│   ├── Student.js             # Student model
│   ├── Subject.js             # Subject model
│   ├── User.js                # User model with methods
│   └── studentRecords.js      # Student records model
├── routes/
│   ├── Maps/                 # Mapping routes
│   ├── auth.js               # Authentication routes
│   ├── index.js              # Main routes
│   ├── students.js           # Student routes
│   └── subjects.js           # Subject routes
├── utils/
│   └── checkField.js         # Utility functions
└── server.js                 # Main application file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mern-auth
   JWT_SECRET=your-super-secret-jwt-key
   ALLOWED_ORIGINS=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📊 Models and Database Schema

### User Model
- Username, email, and password for authentication
- Secure password hashing with bcrypt
- JWT token generation methods

### Student Model
- Basic information: name, PRN (Permanent Registration Number), roll number
- Contact details: mobile number
- Subject association

### Subject Model
- Subject details: name, code, description
- Associated with users who can manage the subject

### Mapping Models
- MapUserAndSubject: Links users to subjects they can manage
- MapStudentAndSubject: Links students to subjects they are enrolled in

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |

### Students

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/students` | Add a new student | Private |
| GET | `/api/students/getStudents/:subjectID` | Get all students for a subject | Private |
| POST | `/api/students/getStudent` | Get a student by ID | Private |
| PUT | `/api/students/:id` | Update a student | Private |
| DELETE | `/api/students/:id` | Delete a student | Private |
| POST | `/api/students/upload-excel` | Upload students via Excel | Private |

### Subjects

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/subjects/:id` | Get subject by ID | Private |
| GET | `/api/subjects` | Get all subjects for a user | Private |
| POST | `/api/subjects` | Create a new subject | Private |
| PUT | `/api/subjects/:id` | Update a subject | Private |
| DELETE | `/api/subjects/:id` | Delete a subject | Private |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## 🔐 Authentication

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

## 📝 Student Management

### Add Student
```bash
POST /api/students
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "Jane Smith",
  "prn": "PRN12345",
  "roll": 42,
  "mobile": "9876543210",
  "subject": "Mathematics"
}
```

### Update Student
```bash
PUT /api/students/60d21b4667d0d8992e610c85
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "Jane Smith",
  "roll": 43,
  "mobile": "9876543210",
  "subject": "Advanced Mathematics"
}
```

## 📚 Subject Management

### Create Subject
```bash
POST /api/subjects
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "Computer Science",
  "code": "CS101",
  "description": "Introduction to Computer Science"
}
```

### Get User Subjects
```bash
GET /api/subjects
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔧 Utilities

### Excel Upload
The system supports uploading student data via Excel files with the following features:
- Bulk student creation
- Validation of uploaded data
- Error handling for invalid entries

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on authentication routes
- CORS protection
- Helmet for HTTP header security
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.