# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hotel Booking System with OAuth2 authentication using React TypeScript frontend and Spring Boot backend.

## Architecture

- **Frontend**: React 19 + TypeScript + Vite + Redux Toolkit + Tailwind CSS v4
- **Backend**: Spring Boot 3.2.0 + Spring Security + OAuth2 Resource Server + MySQL
- **Database**: MySQL (via XAMPP)
- **Authentication**: JWT tokens with OAuth2 flow through Keycloak

## Development Commands

### Frontend (in `frontend/` directory)
- `npm install` - Install dependencies
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run lint` - Run ESLint

### Backend (in `backend/` directory)
- `mvn clean install` - Clean and build project
- `mvn spring-boot:run` - Start backend server (http://localhost:8080)
- `mvn test` - Run tests

## Prerequisites for Development

1. **XAMPP**: Start Apache & MySQL services
2. **MySQL Database**: Create `hotel_booking` database
3. **Keycloak Server**: 
   - Realm: `hotel-booking`
   - Client: `hotel-booking-client`
   - Redirect URI: `http://localhost:5173/callback`

## Key Architecture Patterns

### Frontend Structure
- **Features-based organization**: `src/features/{bookings,rooms}/`
- **Redux Toolkit**: State management with slices in `src/store/`
- **Service Layer**: API calls in `src/services/` and feature-specific services
- **Type Definitions**: Shared types in `src/types/`
- **Components**: Reusable UI in `src/components/`

### Backend Structure
- **Layered Architecture**: Controller → Service → Repository
- **DTOs**: Request/Response objects in `dto/` package
- **Entities**: JPA entities with MySQL dialect
- **Security**: JWT filter chain with Spring Security
- **Configuration**: Security config and JWT service

## Database Configuration

Uses MySQL with the following connection:
- URL: `jdbc:mysql://localhost:3306/hotel_booking`
- Username: `root`
- Password: (empty)
- DDL: Auto-update enabled
- Initial data loaded from `data.sql`

## Authentication Flow

1. Frontend redirects to Keycloak for OAuth2 authentication
2. Keycloak callback returns authorization code
3. Code exchanged for JWT token via backend
4. JWT stored in localStorage for API authentication
5. Backend validates JWT on protected endpoints

## API Structure

- **Public**: `/api/public/*` (health checks, OAuth config)
- **Protected**: `/api/auth/*` (user info, validation)
- **Resources**: `/api/rooms/*`, `/api/bookings/*`, `/api/amenities/*`

## Testing

Backend includes Spring Boot Test and Spring Security Test dependencies. No specific test runner configured for frontend.