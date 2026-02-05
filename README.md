# My Mobile App - Angular Frontend

A modern Angular application with authentication and dashboard functionality, built with Angular Material Design.

## 🚀 Features

### Authentication System
- **Sign In Component**: Modern login form with email/password validation
- **Sign Up Component**: Complete registration form with password confirmation
- **JWT Token Management**: Secure authentication with token storage
- **Form Validation**: Comprehensive client-side validation with error messages
- **Loading States**: Visual feedback during authentication processes

### Dashboard System
- **Interactive Dashboard**: Real-time data visualization
- **Date Range Selection**: Filter data by custom date ranges
- **Client ID Filtering**: Multi-tenant support with client-specific data
- **Purchase & Sales Summary**: Key metrics display with summary cards
- **Transaction Details**: Detailed tables for purchase and sales data
- **Responsive Design**: Mobile-friendly interface

### UI/UX Features
- **Material Design**: Modern, consistent UI using Angular Material
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Loading Indicators**: Spinners and progress indicators
- **Error Handling**: User-friendly error messages and notifications
- **Success Feedback**: Positive confirmation messages
- **Smooth Animations**: Hover effects and transitions

## 🛠️ Technology Stack

- **Angular 19.2**: Latest version with standalone components
- **Angular Material**: UI component library
- **Angular Forms**: Reactive forms with validation
- **Angular Router**: Client-side routing
- **Angular HTTP Client**: API communication
- **TypeScript**: Type-safe development
- **SCSS**: Advanced styling with CSS preprocessor

## 📁 Project Structure

```
src/
├── app/
│   ├── signin/                 # Login component
│   │   ├── signin.component.ts
│   │   ├── signin.component.html
│   │   └── signin.component.scss
│   ├── sign-up/               # Registration component
│   │   ├── sign-up.component.ts
│   │   ├── sign-up.component.html
│   │   └── sign-up.component.scss
│   ├── dashboard/             # Dashboard component
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.scss
│   ├── services/              # Application services
│   │   ├── auth.service.ts    # Authentication service
│   │   └── dashboard.service.ts # Dashboard data service
│   ├── app.component.ts       # Main app component
│   ├── app.routes.ts          # Application routing
│   └── app.config.ts          # App configuration
├── assets/
│   └── icon.svg              # App icon
└── styles.scss               # Global styles
```

## 🔧 Components Overview

### Sign In Component (`signin/`)
- **Purpose**: User authentication
- **Features**:
  - Email and password validation
  - Loading spinner during login
  - Error handling with snackbar notifications
  - Responsive design
  - Navigation to dashboard on success

### Sign Up Component (`sign-up/`)
- **Purpose**: New user registration
- **Features**:
  - Comprehensive form validation
  - Password confirmation matching
  - Mobile number validation (optional)
  - Loading states
  - Success feedback and navigation

### Dashboard Component (`dashboard/`)
- **Purpose**: Data visualization and management
- **Features**:
  - Date range picker for data filtering
  - Client ID selection
  - Purchase and sales summary cards
  - Detailed transaction tables
  - Tabbed interface for different data types
  - Logout functionality

### Services

#### AuthService (`services/auth.service.ts`)
- **Login**: Authenticate users and store JWT tokens
- **Register**: Create new user accounts
- **Token Management**: Store, retrieve, and clear authentication tokens
- **Login Status**: Check if user is authenticated

#### DashboardService (`services/dashboard.service.ts`)
- **Data Fetching**: Retrieve dashboard summary data
- **Authentication Headers**: Include JWT tokens in API requests
- **Error Handling**: Manage API communication errors

## 🎨 Design System

### Color Scheme
- **Primary**: Indigo (#3f51b5)
- **Accent**: Pink (#ff4081)
- **Success**: Green (#4caf50)
- **Error**: Red (#f44336)
- **Background**: Gradient backgrounds for visual appeal

### Typography
- **Font Family**: Roboto (Material Design standard)
- **Font Weights**: 300, 400, 500, 600
- **Responsive**: Scales appropriately across devices

### Components
- **Cards**: Elevated surfaces with shadows
- **Buttons**: Material Design buttons with hover effects
- **Forms**: Outlined form fields with validation
- **Tables**: Clean, readable data tables
- **Tabs**: Organized content navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
```bash
npm start
```
Navigate to `http://localhost:4200/`

### Build for Production
```bash
npm run build
```

## 🔗 API Integration

The application integrates with a .NET Core backend API:

- **Base URL**: `http://69.62.83.25:5000/api`
- **Authentication**: JWT Bearer tokens
- **Endpoints**:
  - `POST /User/login` - User authentication
  - `POST /User/register` - User registration
  - `GET /Dashboard/summary` - Dashboard data (protected)

## 📱 Responsive Design

The application is fully responsive with:
- **Desktop**: Full-featured interface with side-by-side layouts
- **Tablet**: Optimized layouts for medium screens
- **Mobile**: Stacked layouts with touch-friendly controls

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Form Validation**: Client-side validation to prevent invalid data
- **CORS Support**: Configured for cross-origin requests
- **Error Handling**: Secure error messages without exposing sensitive data

## 🎯 Future Enhancements

- [ ] User profile management
- [ ] Password reset functionality
- [ ] Advanced filtering and search
- [ ] Data export capabilities
- [ ] Real-time notifications
- [ ] Dark mode theme
- [ ] Offline support
- [ ] Unit and integration tests

## 📄 License

This project is licensed under the MIT License.
