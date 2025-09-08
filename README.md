# Hotel Booking System

A full-stack hotel booking system with OAuth2 authentication, built with React TypeScript frontend and Spring Boot backend.

## Features

- **Authentication**: OAuth2 integration
- **Room Management**: Add, edit, and manage hotel rooms with amenities
- **Booking System**: Complete booking workflow with guest information
- **Dashboard Analytics**: Occupancy rates, check-in/check-out tracking
- **Room Service**: Order and manage room services
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite build tool
- Redux Toolkit for state management
- Tailwind CSS v4 for styling
- Chart.js for data visualization

### Backend
- Spring Boot 3.2.0
- Spring Security with OAuth2 Resource Server
- JWT token authentication
- MySQL database
- Maven build system

## Prerequisites

1. **Java 17+** - For Spring Boot backend
2. **Node.js 18+** - For React frontend
3. **MySQL** - Database (via XAMPP recommended)
4. **Keycloak Server** - OAuth2 authentication provider

## Setup Instructions

### Database Setup
1. Install and start XAMPP
2. Start Apache and MySQL services
3. Create database: `hotel_booking`
4. Import schema from `hotel_booking.sql`

### Keycloak Configuration
1. Setup Keycloak server
2. Create realm: `hotel-booking`
3. Create client: `hotel-booking-client`
4. Set redirect URI: `http://localhost:5173/callback`

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

## Project Structure

```
booking-hotel/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   │   ├── config/         # Security and JWT configuration
│   │   ├── controller/     # REST API controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data access layer
│   │   └── service/        # Business logic
│   └── src/main/resources/ # Configuration files
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── features/       # Feature-based modules
│   │   ├── services/       # API service calls
│   │   ├── store/          # Redux store and slices
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
└── hotel_booking.sql       # Database schema
```

## API Endpoints

### Public Endpoints
- `GET /api/public/health` - Health check
- `POST /api/public/auth/oauth-config` - OAuth configuration
- `POST /api/public/auth/callback` - OAuth callback

### Protected Endpoints
- `GET /api/rooms` - List rooms
- `POST /api/bookings` - Create booking
- `GET /api/dashboard/occupancy` - Get occupancy data
- `POST /api/room-services` - Order room service

## Development Commands

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Backend
- `mvn spring-boot:run` - Start development server
- `mvn test` - Run tests
- `mvn clean install` - Clean build

## Authentication Flow

1. User clicks login → Redirected to Keycloak
2. User authenticates → Keycloak returns authorization code
3. Frontend exchanges code for JWT token via backend
4. JWT stored in localStorage for API calls
5. Backend validates JWT on protected endpoints

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## License

This project is licensed under the MIT License.
