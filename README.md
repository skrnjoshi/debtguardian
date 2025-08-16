# DebtGuardian 💳

A professional debt and loan management application built with React, TypeScript, and Node.js. Track your loans, payments, and financial health with an intuitive dashboard.

![DebtGuardian Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933)

## ✨ Features

- **🏦 Loan Management**: Track multiple loans with detailed information
- **📊 Financial Analytics**: Real-time financial health insights
- **💰 Payment Tracking**: Monitor payment history and progress
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🔐 Secure Authentication**: JWT-based user authentication
- **🎯 Progress Visualization**: Visual loan progress bars and charts
- **💸 Payoff Calculator**: Calculate loan payoff scenarios
- **📈 Dashboard Overview**: Comprehensive financial overview

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/DebtGuardian.git
   cd DebtGuardian
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database URL and JWT secret:

   ```env
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="your_super_secure_jwt_secret_key"
   NODE_ENV="development"
   ```

4. **Initialize the database**

   ```bash
   npm run db:push
   ```

5. **Start the application**

   **Option 1: Start everything at once**

   ```bash
   ./start-app.sh
   ```

   **Option 2: Start services separately**

   Backend (Terminal 1):

   ```bash
   ./start-backend.sh
   # or
   PORT=8001 npx tsx server/index.ts
   ```

   Frontend (Terminal 2):

   ```bash
   ./start-frontend.sh
   # or
   npm run dev:client
   ```

6. **Open the application**
   - Frontend: http://localhost:5002
   - Backend API: http://localhost:8001

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Recharts** - Data visualization
- **Wouter** - Lightweight routing

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe backend
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Production database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### DevOps

- **Docker** - Containerization
- **GitHub Actions** - CI/CD (coming soon)
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
DebtGuardian/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
├── server/                 # Node.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   ├── authMiddleware.ts  # Authentication middleware
│   └── db.ts              # Database configuration
├── shared/                 # Shared types and schemas
├── scripts/               # Database and utility scripts
├── start-app.sh           # Start both services
├── start-backend.sh       # Start backend only
└── start-frontend.sh      # Start frontend only
```

## 🔧 Available Scripts

- `npm run dev` - Start backend server
- `npm run dev:client` - Start frontend dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open database studio
- `./start-app.sh` - Start both services
- `./start-backend.sh` - Start backend only
- `./start-frontend.sh` - Start frontend only

## 🚀 Deployment

### Environment Variables

Set these environment variables for production:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secure-secret-key-minimum-32-characters"
NODE_ENV="production"
PORT="8001"
```

### Docker Deployment

```bash
# Build the image
docker build -t debtguardian .

# Run the container
docker run -p 8001:8001 \
  -e DATABASE_URL="your_database_url" \
  -e JWT_SECRET="your_jwt_secret" \
  -e NODE_ENV="production" \
  debtguardian
```

### Manual Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🧪 API Documentation

### Authentication

- `POST /api/signup` - Create new user account
- `POST /api/login` - User login
- `GET /api/auth/user` - Get current user info

### Loans

- `GET /api/loans` - Get user's loans
- `POST /api/loans` - Create new loan
- `PUT /api/loans/:id` - Update loan
- `PATCH /api/loans/:id/close` - Close loan
- `DELETE /api/loans/:id` - Delete loan

### Analytics

- `GET /api/analytics/overview` - Financial overview
- `GET /api/payments/recent` - Recent payments

### User Profile

- `PUT /api/user/profile` - Update user profile

## 🔐 Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- SQL injection prevention with ORM
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by financial management needs
- Thanks to the open-source community

---

⭐ **Star this repository if you found it helpful!**
