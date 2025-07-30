# Loan Manager Pro - System Architecture

## Overview

Loan Manager Pro is a comprehensive loan management application built with a modern full-stack architecture. The application allows users to track their loans, make payments, and analyze their financial health with detailed analytics and visualizations. The system uses a monorepo structure with shared TypeScript schemas and integrates with Replit's authentication system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client, server, and shared components:

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit's OpenID Connect (OIDC) authentication
- **Session Management**: Express sessions with PostgreSQL store

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Neon Database serverless with WebSocket support
- **Schema**: Shared TypeScript schema definitions with Zod validation

## Key Components

### Authentication System
- **Provider**: Replit OIDC authentication
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Security**: HTTPOnly cookies with secure session handling

### Data Models
- **Users**: Profile information including salary for financial calculations
- **Loans**: Comprehensive loan tracking with EMI calculations
- **Payments**: Payment history with different payment types (EMI, extra, prepayment)
- **Sessions**: Secure session storage for authentication

### UI Components
- **Design System**: Consistent component library using Shadcn/ui
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: Built-in accessibility features through Radix UI
- **Theming**: CSS variables for easy theme customization

### Analytics and Visualization
- **Financial Health**: Debt-to-income ratio calculations and health scoring
- **Payment Analytics**: Payment history tracking and visualization
- **Loan Portfolio**: Comprehensive loan overview with progress tracking
- **Charts**: Interactive charts for loan distribution and payment analysis

## Data Flow

### Authentication Flow
1. User accesses application
2. Replit OIDC authentication redirects to login if not authenticated
3. Successful authentication creates/updates user profile
4. Session established with PostgreSQL storage
5. Protected routes accessible with valid session

### Loan Management Flow
1. User initialization creates sample loans for new users
2. Loan data fetched from PostgreSQL via Drizzle ORM
3. Real-time calculations for EMI ratios and financial health
4. Payment submissions update loan balances and payment history
5. Analytics computed from current loan and payment data

### Data Persistence
1. All data stored in PostgreSQL database
2. Drizzle ORM handles type-safe database operations
3. Migrations managed through Drizzle Kit
4. Real-time updates reflected in UI through React Query

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection with serverless support
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing
- **@radix-ui/***: Accessible UI component primitives

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the full stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint/Prettier**: Code quality and formatting

### Authentication
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database serverless PostgreSQL
- **Environment Variables**: Database URL and session secrets required

### Build Process
- **Frontend**: Vite builds React application to static assets
- **Backend**: ESBuild bundles Express server for production
- **Database**: Drizzle migrations applied via `db:push` command

### Production Considerations
- **Static Assets**: Served from Express in production
- **Database Connection**: Pooled connections through Neon serverless
- **Session Security**: Secure cookies with proper domain configuration
- **Error Handling**: Comprehensive error boundaries and API error responses

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Secure session signing key (required)
- **REPLIT_DOMAINS**: Allowed domains for OIDC (required for Replit auth)
- **ISSUER_URL**: OIDC issuer URL (defaults to Replit)

The application is designed to be deployed on Replit with automatic provisioning of PostgreSQL databases and seamless integration with Replit's authentication system.

## Recent Updates (January 30, 2025)

### Fixed Issues
- **Payment System**: Resolved TypeScript validation errors for amount and date parsing in payment submissions
- **Interactive UI Elements**: Added fully functional three-dot dropdown menus in loan cards with proper click-to-open/close behavior
- **Quick Actions**: Enabled all Quick Actions buttons with smooth scrolling to payment form and informative user feedback
- **Enhanced UX**: Added proper loading states, error handling, and toast notifications throughout the application
- **Menu Actions**: Implemented payment history viewing, payoff calculations, and loan editing options with contextual information
- **Data Validation**: Fixed Zod schema to handle string/number conversion and proper date handling in payment forms

### Current Functionality
- **Fully Functional Payment Logging**: Users can successfully log payments with automatic balance updates
- **Interactive Loan Management**: Three-dot menus provide access to loan-specific actions and calculations
- **Real-time Financial Analytics**: Charts and metrics update automatically after payment submissions
- **Responsive Design**: Application works seamlessly across desktop and mobile devices
- **Indian Currency Formatting**: Proper ₹ symbol and number formatting throughout the interface