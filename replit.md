# Logo Generator AI Application

## Overview

This is a full-stack logo generation application that uses Google's Gemini AI to create custom logos based on user input. The application features a React frontend with shadcn/ui components and an Express backend that processes logo generation requests through the Gemini API. Users can input their brand details and receive multiple logo variations in different styles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: React Hook Form for form handling, TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Component Structure**: Modular components with clear separation between UI, business logic, and presentation layers

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with a single POST endpoint `/api/generate` for logo generation
- **Data Storage**: In-memory storage using a Map-based implementation (MemStorage class)
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Development Setup**: Custom Vite integration for development with hot reloading

### Data Management
- **Schema Validation**: Zod schemas for request/response validation and type safety
- **Database Schema**: Drizzle ORM configured for PostgreSQL (though currently using in-memory storage)
- **Data Models**: LogoRequest entity storing brand information and generated logos as JSON

### AI Integration
- **Service**: Google Gemini AI integration for logo generation
- **Generation Strategy**: Creates 4 different logo styles per request (Modern Gradient, Minimalist Badge, Geometric Bold, Classic Circle)
- **Response Format**: Returns structured logo data with style information and base64 image data

### Authentication & Security
- **Current State**: No authentication system implemented
- **Session Management**: Basic session setup with connect-pg-simple (configured but not actively used)
- **Input Validation**: Request validation using Zod schemas to prevent malformed data

### Development & Build
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Development**: Integrated development server with both frontend and backend
- **TypeScript**: Full TypeScript support with path mapping and strict configuration
- **Code Organization**: Monorepo structure with shared types and schemas

## External Dependencies

### AI Services
- **Google Gemini AI**: Primary AI service for logo generation using `@google/genai` package
- **API Key Management**: Supports both `GEMINI_API_KEY` and `GOOGLE_AI_API_KEY` environment variables

### Database & Storage
- **PostgreSQL**: Configured via Drizzle ORM and Neon Database serverless driver
- **Environment**: Requires `DATABASE_URL` for production database connection
- **Current Implementation**: Using in-memory storage for development/demo purposes

### UI & Styling
- **Radix UI**: Comprehensive set of unstyled UI primitives for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Custom font loading for typography

### Development Tools
- **Vite**: Build tool and development server with React plugin
- **Replit Integration**: Custom plugins for Replit environment development
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **ESBuild**: Fast bundling for server-side code

### Form & Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Utilities
- **Date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class handling
- **nanoid**: Unique ID generation for client-side operations