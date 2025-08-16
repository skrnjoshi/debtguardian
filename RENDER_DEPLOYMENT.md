# 🚀 Render Deployment Guide

This guide will help you deploy your DebtGuardian app to Render using GitHub.

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Render account (free tier available)
3. ✅ PostgreSQL database (we'll use Render PostgreSQL)

## 🎯 Step-by-Step Deployment

### Step 1: Push to GitHub

1. **Create a new GitHub repository:**

   - Go to GitHub.com
   - Click "New repository"
   - Name it `DebtGuardian`
   - Make it public
   - Don't initialize with README (we already have one)

2. **Push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DebtGuardian - Professional debt management app"
   git remote add origin https://github.com/YOUR_USERNAME/DebtGuardian.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create PostgreSQL Database on Render

1. **Go to Render Dashboard:**

   - Visit [render.com](https://render.com)
   - Sign up/login with GitHub

2. **Create PostgreSQL Database:**

   - Click "New +"
   - Select "PostgreSQL"
   - Name: `debtguardian-db`
   - Plan: Free (or paid for production)
   - Click "Create Database"

3. **Get Database Connection String:**
   - After creation, go to database dashboard
   - Copy the "External Database URL" (starts with `postgresql://`)

### Step 3: Deploy Web Service

1. **Create Web Service:**

   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

2. **Configure Service:**

   ```
   Name: debtguardian
   Root Directory: ./
   Environment: Node
   Region: Oregon (or closest to you)
   Branch: main
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables:**
   Click "Environment" tab and add:

   ```
   NODE_ENV=production
   DATABASE_URL=your_postgresql_connection_string_from_step_2
   JWT_SECRET=your_super_secure_jwt_secret_at_least_32_characters_long
   PORT=10000
   ```

4. **Advanced Settings:**

   - Auto-Deploy: Yes
   - Plan: Free (or paid for production)

5. **Click "Create Web Service"**

### Step 4: Verify Deployment

1. **Wait for build to complete** (5-10 minutes)
2. **Check deployment logs** for any errors
3. **Visit your app URL** (Render will provide this)
4. **Test the app:**
   - Create an account
   - Add a loan
   - Check dashboard functionality

## 🔧 Environment Variables Required

```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_super_secure_secret_key_minimum_32_characters
PORT=10000
```

## 🌐 Your App URLs

After deployment, you'll get:

- **App URL**: `https://debtguardian-xxx.onrender.com`
- **Database URL**: Internal connection string provided by Render

## 🛠️ Common Issues & Solutions

### Build Fails

```bash
# Check logs for specific errors
# Common fixes:
- Ensure all dependencies are in package.json
- Check Node.js version compatibility
- Verify build scripts work locally
```

### Database Connection Issues

```bash
# Verify DATABASE_URL format:
postgresql://username:password@host:port/database

# Check database is running and accessible
```

### App Won't Start

```bash
# Check start script in package.json:
"start": "NODE_ENV=production node dist/index.js"

# Verify build output exists in dist/ folder
```

## 🔄 Automatic Deployments

Once set up, your app will automatically deploy when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Render will automatically build and deploy!
```

## 📊 Monitoring

1. **Render Dashboard:**

   - View deployment logs
   - Monitor performance
   - Check resource usage

2. **App Health:**
   - Visit: `your-app-url/api/test`
   - Should return: `{"message":"API is working"}`

## 💡 Production Tips

1. **Use Paid Plans** for production:

   - Better performance
   - No sleep mode
   - More resources

2. **Set up Custom Domain:**

   - Go to Settings → Custom Domains
   - Add your domain
   - Configure DNS

3. **Enable SSL** (automatic with Render)

4. **Monitor Performance:**
   - Set up alerts
   - Monitor response times
   - Check error rates

## 🎉 Congratulations!

Your DebtGuardian app is now live on Render! Share the URL with others and start managing debts professionally.

**Your deployment checklist:**

- ✅ Code pushed to GitHub
- ✅ PostgreSQL database created
- ✅ Web service deployed
- ✅ Environment variables set
- ✅ App tested and working
- ✅ Automatic deployments enabled

---

**Need help?** Check Render's documentation or create an issue in your GitHub repo.
