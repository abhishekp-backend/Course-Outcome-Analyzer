# CO-PO Mapping System

## Overview

This is a web application designed to help educators manage Course Outcomes (CO) and Program Outcomes (PO) mapping for academic courses. The system allows teachers to track student performance across various assessment components and analyze how they contribute to course outcomes.

## Features

- **User Authentication**: Secure login and registration system
- **Subject Management**: Add, view, edit, and delete teaching subjects
- **Student Management**: Add students individually or import via Excel
- **Assessment Tracking**: Record and update student marks for various assessment components:
  - Unit Tests (UT1, UT2) with CO mapping
  - Internal Assessment (IA)
  - Project Based Learning (PBL)
  - Term Work (TW)
- **CO-PO Correlation**: Map course outcomes to program outcomes

## Technology Stack

### Frontend
- React 19
- Redux Toolkit for state management
- React Router for navigation
- TailwindCSS for styling

### Backend
- RESTful API (running on http://localhost:5000)
- JWT authentication

## Getting Started

### Prerequisites
- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. The application will be available at http://localhost:5173

## Project Structure

```
├── public/                # Static assets
├── src/
│   ├── assets/           # Application assets
│   ├── Components/        # React components
│   │   ├── Authentication/# Login and signup components
│   │   ├── Dashboard/     # Dashboard components
│   │   ├── Layout/        # Layout components
│   │   ├── Student/       # Student management components
│   │   └── Subject/       # Subject management components
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Redux store configuration
│   │   └── slices/       # Redux slices for state management
│   └── utils/            # Utility functions
└── vite.config.js        # Vite configuration
```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Expanding the ESLint configuration

If you need to customize the ESLint configuration, you can modify the `eslint.config.js` file. The project uses the new flat config format for ESLint.

## API Integration

The application communicates with a backend API running on http://localhost:5000. The API endpoints include:

- Authentication: `/api/auth/login`, `/api/auth/register`, `/api/auth/profile`
- Subjects: `/api/subjects`
- Students: `/api/students`, `/api/students/getStudents/:subjectId`, `/api/students/upload-excel`

## License

This project is licensed under the MIT License.
