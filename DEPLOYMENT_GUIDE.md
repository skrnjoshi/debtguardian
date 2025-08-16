# GitHub Deployment Guide 🚀

## Quick Deployment Commands

### 1. Start Everything (One Command)

```bash
./start-app.sh
```

### 2. Start Services Separately

**Backend Only:**

```bash
./start-backend.sh
```

**Frontend Only:**

```bash
./start-frontend.sh
```

**Manual Commands:**

```bash
# Backend
PORT=8001 NODE_ENV=development npx tsx server/index.ts

# Frontend (separate terminal)
npm run dev:client
```

### 3. Stop Everything

```bash
pkill -f "tsx server/index.ts" && pkill -f "vite"
```

## Troubleshooting

### If you get "Connection Refused" errors:

1. **Kill all processes:**

   ```bash
   pkill -f "vite" && pkill -f "tsx server/index.ts"
   ```

2. **Check ports are free:**

   ```bash
   lsof -i :8001 && lsof -i :5002
   ```

3. **Start backend first:**

   ```bash
   PORT=8001 npx tsx server/index.ts
   ```

4. **Start frontend (new terminal):**

   ```bash
   npm run dev:client
   ```

5. **Open browser:**
   - Frontend: http://localhost:5002
   - Backend API: http://localhost:8001

### Common Issues:

- **Port conflicts**: Kill existing processes with `pkill` commands
- **Database connection**: Check your `.env` file has correct `DATABASE_URL`
- **Infinite spinner**: Check browser console (F12) for network errors
- **Build errors**: Run `npm install` to ensure all dependencies are installed

## Production Deployment

1. **Build the app:**

   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

Your app is now ready for GitHub! 🎉
