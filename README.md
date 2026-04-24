# UKK Library Management System - User App

A modern mobile-first web application for library users to browse, borrow, and manage library items. Built with React, TypeScript, and Vite for optimal performance and developer experience.

## Features

### Item Management
- Browse library items with search and filtering
- View detailed item information
- Category-based item organization
- Popular items carousel

### Borrowing System
- Request item borrowing
- View borrowing history and status
- QR code scanning for quick access
- Real-time borrowing status updates

### User Management
- User authentication (login/register)
- Profile management
- Password reset functionality
- Email verification

### Notifications
- Real-time notifications via SSE (Server-Sent Events)
- Borrowing status updates
- System announcements

### Modern UI/UX
- Mobile-first responsive design using Konsta UI
- Smooth animations with Framer Motion
- Dark/light theme support
- Intuitive navigation with bottom tabs

## Tech Stack

### Frontend Framework
- **React 19** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### UI & Styling
- **Konsta UI** - Mobile-first UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Routing & State Management
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Powerful data fetching and caching
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation

### Additional Libraries
- **Axios** - HTTP client
- **QR Code Libraries** - QR code generation and scanning
- **React Intersection Observer** - Lazy loading and scroll detection
- **JS Cookies** - Cookie management
- **Midtrans** - Payment integration

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fe/User
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── api/                 # API service functions
├── assets/              # Static assets
├── components/          # Reusable UI components
│   ├── custom/          # Custom components
│   └── skeletons/       # Loading skeleton components
├── context/             # React context providers
├── interfaces/          # TypeScript type definitions
├── middlewares/         # Route protection middleware
├── pages/               # Page components
├── routes/              # Route definitions
├── schemas/             # Validation schemas
└── utils/               # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The app integrates with a backend API that provides:
- Authentication endpoints
- Item management
- Borrowing operations
- Notification system
- Payment processing (Midtrans)

## Mobile Features

- **Touch Gestures** - Swipe navigation and interactions
- **QR Scanning** - Camera-based QR code scanning

## Security

- JWT-based authentication
- Secure API communication
- Input validation with Zod schemas
- Protected routes with middleware