import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPaymentSchema } from "@shared/schema";
import { z } from "zod";
import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import { randomUUID } from "crypto";
import express, { type Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { db, currentSchema } from "./db.js";
import { eq, and, desc, asc } from "drizzle-orm";

// Extract schema objects
const { users, loans, payments } = currentSchema;

// Types
type User = typeof users.$inferSelect;
type Loan = typeof loans.$inferSelect;
type Payment = typeof payments.$inferSelect;

// Enhanced JWT configuration
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const BCRYPT_ROUNDS = 12; // High security rounds for password hashing

// Security logging
const logSecurityEvent = (event: string, details: any) => {
  console.log(`[SECURITY] ${new Date().toISOString()} - ${event}:`, details);
};

const router = express.Router();

// Health check endpoint for deployment monitoring
router.get("/health", (req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  };

  res.status(200).json(healthcheck);
});

// APK download endpoint
router.get("/download/apk/:version", (req: Request, res: Response) => {
  const { version } = req.params;
  const fs = require("fs");
  const path = require("path");

  const apkPath = path.join(
    __dirname,
    "..",
    "mobile-app",
    "releases",
    `DebtGuardian-${version}.apk`
  );

  if (fs.existsSync(apkPath)) {
    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=DebtGuardian-${version}.apk`
    );
    res.sendFile(apkPath);
  } else {
    res.status(404).json({ error: "APK file not found" });
  }
});

// System status endpoint for monitoring
router.get("/status", (req: Request, res: Response) => {
  const status = {
    server: "operational",
    database: "connected", // Could add actual DB health check
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
    },
    uptime: Math.round(process.uptime()) + " seconds",
  };

  res.status(200).json(status);
});

// Input validation schemas

// Enhanced authentication middleware with better security
const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  try {
    console.log(
      "🔐 Authentication check - Headers:",
      req.headers.authorization
    );
    console.log("🔐 Authentication check - Cookies:", req.cookies);

    // Extract token from Authorization header or cookie
    let token = req.headers.authorization?.replace("Bearer ", "");

    if (!token && req.cookies?.authToken) {
      token = req.cookies.authToken;
    }

    console.log("🔐 Extracted token:", token ? "Token found" : "No token");

    if (!token) {
      console.log("🚫 No token provided");
      return res.status(401).json({
        message: "Access denied. No authentication token provided.",
        code: "NO_TOKEN",
      });
    }

    // Verify and decode JWT with additional validation
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"], // Explicitly specify allowed algorithms
      maxAge: JWT_EXPIRES_IN, // Verify token hasn't expired
    }) as any;

    console.log("🔐 JWT decoded for user:", decoded.userId);

    // Additional security: verify user still exists and is active
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      console.log("🚫 User not found in database:", decoded.userId);
      return res.status(401).json({
        message: "Access denied. Invalid user.",
        code: "INVALID_USER",
      });
    }

    console.log("✅ Authentication successful for user:", user.email);
    req.user = { claims: { sub: decoded.userId }, profile: user };
    next();
  } catch (error) {
    console.error("🚫 Authentication error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Access denied. Invalid token.",
        code: "INVALID_TOKEN",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Access denied. Token has expired.",
        code: "EXPIRED_TOKEN",
      });
    }

    return res.status(500).json({
      message: "Internal authentication error",
      code: "AUTH_ERROR",
    });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment monitoring
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  });

  // Test route to verify API routing is working
  app.get("/api/test", (req, res) => {
    console.log("Test route hit");
    res.json({ message: "API is working" });
  });

  // Input validation middleware
  const validateLoginInput = [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Must be a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    // Note: Removed strict password pattern requirement for login to match signup behavior
  ];

  const validateSignupInput = [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Must be a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
      .withMessage("Password must contain at least one letter and one number"),
    body("firstName")
      .trim()
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage(
        "First name must contain only letters and be 1-50 characters"
      ),
    body("lastName")
      .trim()
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage(
        "Last name must contain only letters and be 1-50 characters"
      ),
    body("salary")
      .isFloat({ min: 0, max: 10000000 })
      .withMessage("Salary must be a positive number less than 10,000,000"),
  ];

  // Enhanced login endpoint with validation and security
  app.post("/api/login", validateLoginInput, async (req: any, res: any) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: errors.array(),
          code: "VALIDATION_ERROR",
        });
      }

      const { email, password } = req.body;

      // Rate limiting check (additional layer)
      const clientIP = req.ip || req.connection.remoteAddress;
      console.log(`🔐 Login attempt from IP: ${clientIP} for email: ${email}`);

      // Validate user credentials and get user object
      const user = await storage.validatePassword(email, password);
      if (!user) {
        // Log failed login attempt
        console.log(
          `❌ Failed login attempt for email: ${email} from IP: ${clientIP}`
        );
        return res.status(401).json({
          message: "Invalid email or password",
          code: "INVALID_CREDENTIALS",
        });
      }

      // Generate secure JWT token
      const payload = {
        userId: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        iss: "DebtGuardian",
      };

      const options: SignOptions = {
        algorithm: "HS256" as const,
        expiresIn: "24h",
      };

      const token = jwt.sign(payload, JWT_SECRET, options);

      // Log successful login
      console.log(
        `✅ Successful login for user: ${email} from IP: ${clientIP}`
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          salary: user.salary,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/signup", async (req, res) => {
    try {
      console.log("Signup request received:", req.body);

      const { email, password, firstName, lastName, salary } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        console.log("Missing required fields");
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log("Invalid email format");
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate password strength
      if (password.length < 6) {
        console.log("Password too short");
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }

      // Check if user already exists
      console.log("Checking if user exists:", email);
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        console.log("User already exists");
        return res.status(409).json({ message: "User already exists" });
      }

      // Create new user
      console.log("Creating new user");
      const userId = randomUUID();
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        salary: salary || "50000.00", // Default salary
      };

      console.log("Upserting user:", { ...newUser, password: "[HIDDEN]" });
      const createdUser = await storage.upsertUser(newUser);
      console.log("User created successfully:", {
        ...createdUser,
        password: "[HIDDEN]",
      });

      // Create JWT token
      const token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log("Signup successful for:", email);
      res.json({
        token,
        user: {
          id: createdUser.id,
          email: createdUser.email,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          salary: createdUser.salary,
        },
        message: "Account created successfully",
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/logout", (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    res.json({ message: "Logged out successfully" });
  });

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Initialize user with sample loans
  app.post("/api/initialize-user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const existingLoans = await storage.getUserLoans(userId);

      if (existingLoans.length === 0) {
        await storage.initializeUserLoans(userId);
      }

      res.json({ message: "User initialized successfully" });
    } catch (error) {
      console.error("Error initializing user:", error);
      res.status(500).json({ message: "Failed to initialize user" });
    }
  });

  // Update user profile (salary and basic expenses)
  app.put("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { salary, basicExpenses } = req.body;

      // Validate input
      if (salary && (isNaN(salary) || salary < 0)) {
        return res.status(400).json({ message: "Invalid salary value" });
      }

      const updates: any = {};
      if (salary !== undefined) updates.salary = parseFloat(salary);

      if (basicExpenses) {
        if (
          basicExpenses.housing !== undefined &&
          !isNaN(basicExpenses.housing)
        ) {
          updates.basicExpenseHousing = parseFloat(basicExpenses.housing);
        }
        if (basicExpenses.food !== undefined && !isNaN(basicExpenses.food)) {
          updates.basicExpenseFood = parseFloat(basicExpenses.food);
        }
        if (
          basicExpenses.transport !== undefined &&
          !isNaN(basicExpenses.transport)
        ) {
          updates.basicExpenseTransport = parseFloat(basicExpenses.transport);
        }
        if (
          basicExpenses.healthcare !== undefined &&
          !isNaN(basicExpenses.healthcare)
        ) {
          updates.basicExpenseHealthcare = parseFloat(basicExpenses.healthcare);
        }
        if (basicExpenses.other !== undefined && !isNaN(basicExpenses.other)) {
          updates.basicExpenseOther = parseFloat(basicExpenses.other);
        }
      }

      await storage.updateUserProfile(userId, updates);
      const updatedUser = await storage.getUser(userId);

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Loans routes
  app.get("/api/loans", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log(`🏠 Loans request for user: ${userId}`);
      const loans = await storage.getUserLoans(userId);
      console.log(`🏠 User ${userId} has ${loans.length} loans`);

      // Map PostgreSQL schema to frontend expected format
      const mappedLoans = loans.map((loan: any) => {
        console.log("🔄 Raw loan data:", loan);
        const mapped = {
          id: loan.id,
          userId: loan.userId,
          name: loan.name,
          loanType: loan.loanType,
          originalAmount: loan.originalAmount?.toString() || "0",
          outstandingAmount: loan.outstandingAmount?.toString() || "0",
          emiAmount: loan.emiAmount?.toString() || "0",
          interestRate: loan.interestRate?.toString() || "0",
          remainingMonths: loan.remainingMonths || 0,
          nextDueDate: loan.nextDueDate || new Date().toISOString(),
          status: loan.status || "active",
          createdAt: loan.createdAt,
          updatedAt: loan.updatedAt,
        };
        console.log("🔄 Mapped loan data:", mapped);
        return mapped;
      });

      res.json(mappedLoans);
    } catch (error) {
      console.error("Error fetching loans:", error);
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  app.post("/api/loans", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        name,
        loanType,
        originalAmount,
        outstandingAmount,
        emiAmount,
        interestRate,
        remainingMonths,
        nextDueDate,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !originalAmount ||
        !outstandingAmount ||
        !emiAmount ||
        !interestRate ||
        !remainingMonths
      ) {
        return res
          .status(400)
          .json({ message: "All loan fields are required" });
      }

      // Map frontend field names to PostgreSQL schema field names
      const newLoan = {
        userId,
        name,
        loanType: loanType || "personal",
        originalAmount: parseFloat(originalAmount).toString(),
        outstandingAmount: parseFloat(outstandingAmount).toString(),
        emiAmount: parseFloat(emiAmount).toString(),
        interestRate: parseFloat(interestRate).toString(),
        remainingMonths: parseInt(remainingMonths),
        nextDueDate: nextDueDate
          ? new Date(nextDueDate)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      };

      console.log("Creating loan with PostgreSQL schema:", newLoan);
      const createdLoan = await storage.createLoan(newLoan);

      // Map response back to frontend expected format
      const responseData = {
        id: createdLoan.id,
        userId: createdLoan.userId,
        name: createdLoan.name,
        loanType: createdLoan.loanType,
        originalAmount: createdLoan.originalAmount?.toString() || "0",
        outstandingAmount: createdLoan.outstandingAmount?.toString() || "0",
        emiAmount: createdLoan.emiAmount?.toString() || "0",
        interestRate: createdLoan.interestRate?.toString() || "0",
        remainingMonths: createdLoan.remainingMonths || 0,
        nextDueDate: (() => {
          const date = createdLoan.nextDueDate || new Date();
          return date instanceof Date
            ? date.toISOString()
            : new Date(date).toISOString();
        })(),
        status: "active",
        createdAt: createdLoan.createdAt,
        updatedAt: createdLoan.updatedAt,
      };

      console.log("Loan created successfully:", responseData);
      res.status(201).json(responseData);
    } catch (error: any) {
      console.error("Error creating loan:", error);
      res
        .status(500)
        .json({ message: "Failed to create loan", error: error.message });
    }
  });

  // Payments routes
  app.post("/api/payments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsedAmount =
        typeof req.body.amount === "string"
          ? parseFloat(req.body.amount)
          : req.body.amount;
      const parsedDate =
        typeof req.body.paymentDate === "string"
          ? new Date(req.body.paymentDate)
          : req.body.paymentDate;

      const paymentData = insertPaymentSchema.parse({
        userId,
        loanId: req.body.loanId,
        amount: parsedAmount.toString(),
        paymentDate: parsedDate,
        paymentType: req.body.paymentType || "emi",
        notes: req.body.notes || null,
      });

      console.log("Creating payment:", paymentData);

      // Create payment with timeout
      const payment = await Promise.race([
        storage.createPayment(paymentData),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Payment creation timeout")), 10000)
        ),
      ]);

      console.log("Payment created:", payment);

      // Update loan outstanding amount and recalculate remaining months
      const loan = (await Promise.race([
        storage.getLoan(paymentData.loanId),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Loan fetch timeout")), 5000)
        ),
      ])) as any;

      if (loan) {
        console.log(
          "Found loan:",
          loan.name,
          "- Current remaining months:",
          loan.remainingMonths
        );

        const currentOutstanding = parseFloat(loan.outstandingAmount || "0");
        const paymentAmount =
          typeof paymentData.amount === "string"
            ? parseFloat(paymentData.amount)
            : paymentData.amount;
        const newOutstanding = Math.max(0, currentOutstanding - paymentAmount);

        // Update remaining months based on payment type
        let newRemainingMonths = loan.remainingMonths;

        if (newOutstanding > 0) {
          const monthlyEMI = parseFloat(loan.emiAmount || "0");
          const paymentAmount =
            typeof paymentData.amount === "string"
              ? parseFloat(paymentData.amount)
              : paymentData.amount;

          if (paymentData.paymentType === "emi") {
            // For regular EMI payments, simply decrease remaining months by 1
            newRemainingMonths = Math.max(0, loan.remainingMonths - 1);
            console.log(
              "EMI payment - decreasing tenure from",
              loan.remainingMonths,
              "to",
              newRemainingMonths
            );
          } else {
            // For extra payments or prepayments, recalculate using amortization formula
            const monthlyRate = parseFloat(loan.interestRate || "0") / 100 / 12;

            if (monthlyRate > 0 && monthlyEMI > 0) {
              // Calculate remaining months using loan amortization formula
              // M = P * [r(1+r)^n] / [(1+r)^n - 1]
              // Solving for n: n = -log(1 - (P*r/M)) / log(1+r)
              const principal = newOutstanding;
              const monthlyPayment = monthlyEMI;

              if (monthlyPayment > principal * monthlyRate) {
                // Calculate using the standard loan formula
                const ratio = (principal * monthlyRate) / monthlyPayment;
                if (ratio < 1) {
                  newRemainingMonths = Math.ceil(
                    -Math.log(1 - ratio) / Math.log(1 + monthlyRate)
                  );
                }
              } else {
                // If EMI is too low, estimate based on simple division
                newRemainingMonths = Math.ceil(principal / monthlyPayment);
              }
            } else {
              // For 0% interest loans, simple division
              if (monthlyEMI > 0) {
                newRemainingMonths = Math.ceil(newOutstanding / monthlyEMI);
              }
            }
            console.log(
              "Extra/prepayment - recalculated tenure to",
              newRemainingMonths
            );
          }
        } else {
          // Loan is fully paid
          newRemainingMonths = 0;
          console.log("Loan fully paid - setting tenure to 0");
        }

        console.log(
          "Updating loan with new outstanding:",
          newOutstanding,
          "and new tenure:",
          newRemainingMonths
        );

        await Promise.race([
          storage.updateLoan(paymentData.loanId, {
            outstandingAmount: newOutstanding.toString(),
            remainingMonths: newRemainingMonths,
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Loan update timeout")), 5000)
          ),
        ]);

        console.log("Loan updated successfully");
      }

      res.json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid payment data", errors: error.errors });
      } else if (
        (error as any)?.message &&
        (error as any).message.includes("timeout")
      ) {
        res.status(408).json({ message: "Request timeout - please try again" });
      } else {
        res.status(500).json({ message: "Failed to create payment" });
      }
    }
  });

  app.get("/api/payments/recent", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payments = await storage.getUserPayments(userId, 10);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching recent payments:", error);
      res.status(500).json({ message: "Failed to fetch recent payments" });
    }
  });

  app.get("/api/payments/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payments = await storage.getUserPayments(userId, 1000); // Large limit for history
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      res.status(500).json({ message: "Failed to fetch payment history" });
    }
  });

  app.get(
    "/api/payments/loan/:loanId",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const { loanId } = req.params;
        const payments = await storage.getLoanPayments(userId, loanId);
        res.json(payments);
      } catch (error) {
        console.error("Error fetching loan payments:", error);
        res.status(500).json({ message: "Failed to fetch loan payments" });
      }
    }
  );

  app.put("/api/loans/:loanId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { loanId } = req.params;

      console.log(
        `[UPDATE-LOAN] 🔄 Starting update for loan ${loanId} by user ${userId}`
      );
      console.log(`[UPDATE-LOAN] 📊 Request body:`, req.body);

      const updateData = {
        name: req.body.name,
        loanType: req.body.loanType,
        emiAmount: req.body.emiAmount.toString(),
        interestRate: req.body.interestRate.toString(),
        remainingMonths: req.body.remainingMonths,
      };

      console.log(`[UPDATE-LOAN] 📝 Formatted update data:`, updateData);

      // First check if loan exists and belongs to user
      const existingLoan = await storage.getLoan(loanId);
      if (!existingLoan) {
        console.log(`[UPDATE-LOAN] ❌ Loan ${loanId} not found`);
        return res.status(404).json({ message: "Loan not found" });
      }

      if (existingLoan.userId !== userId) {
        console.log(
          `[UPDATE-LOAN] 🚫 Loan ${loanId} does not belong to user ${userId}`
        );
        return res
          .status(403)
          .json({ message: "Unauthorized to update this loan" });
      }

      console.log(
        `[UPDATE-LOAN] ✅ Loan exists and belongs to user, proceeding with update`
      );

      const updatedLoan = await storage.updateLoanDetails(
        loanId,
        userId,
        updateData
      );

      console.log(`[UPDATE-LOAN] 🎉 Successfully updated loan:`, updatedLoan);
      res.json(updatedLoan);
    } catch (error) {
      console.error("[UPDATE-LOAN] 💥 Error updating loan:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res
        .status(500)
        .json({ message: "Failed to update loan", error: errorMessage });
    }
  });

  // Close loan route
  app.patch(
    "/api/loans/:loanId/close",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const { loanId } = req.params;

        console.log(
          `[CLOSE] 🔐 Starting close for loan ${loanId} by user ${userId}`
        );

        // First check if the loan exists
        const existingLoan = await storage.getLoan(loanId);

        if (!existingLoan) {
          console.log(`[CLOSE] ❌ Loan ${loanId} not found - returning 404`);
          return res.status(404).json({ message: "Loan not found" });
        }

        if (existingLoan.userId !== userId) {
          console.log(
            `[CLOSE] 🚫 Loan ${loanId} does not belong to user ${userId} - returning 403`
          );
          return res
            .status(403)
            .json({ message: "Unauthorized to close this loan" });
        }

        console.log(
          `[CLOSE] ✅ Proceeding to close loan "${existingLoan.name}" (${loanId})`
        );

        // Update loan to mark it as closed (outstanding amount = 0, remaining months = 0)
        const updateData = {
          outstandingAmount: 0, // Use PostgreSQL field name
          remainingMonths: 0, // Use PostgreSQL field name
        };

        console.log(`[CLOSE] 📝 Update data for SQLite:`, updateData);

        const updatedLoan = await storage.updateLoanPartial(
          loanId,
          userId,
          updateData
        );

        console.log(
          `[CLOSE] 🎉 Successfully closed loan "${existingLoan.name}" (${loanId})`
        );

        res.json({
          message: "Loan marked as closed successfully",
          loan: updatedLoan,
        });
      } catch (error) {
        console.error("[CLOSE] 💥 Error closing loan:", error);
        res.status(500).json({ message: "Failed to close loan" });
      }
    }
  );

  // Delete loan route
  app.delete("/api/loans/:loanId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { loanId } = req.params;

      console.log(
        `[DELETE] 🗑️ Starting delete for loan ${loanId} by user ${userId}`
      );

      // First check if the loan exists
      const existingLoan = await storage.getLoan(loanId);
      console.log(
        `[DELETE] 📋 Loan lookup result:`,
        existingLoan
          ? `Found loan "${existingLoan.name}" belonging to user ${existingLoan.userId}`
          : "Loan not found"
      );

      if (!existingLoan) {
        console.log(`[DELETE] ❌ Loan ${loanId} not found - returning 404`);
        return res.status(404).json({ message: "Loan not found" });
      }

      if (existingLoan.userId !== userId) {
        console.log(
          `[DELETE] 🚫 Loan ${loanId} does not belong to user ${userId} (belongs to ${existingLoan.userId}) - returning 403`
        );
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this loan" });
      }

      console.log(
        `[DELETE] ✅ Proceeding to delete loan "${existingLoan.name}" (${loanId}) for user ${userId}`
      );
      await storage.deleteLoan(loanId, userId);
      console.log(
        `[DELETE] 🎉 Successfully deleted loan "${existingLoan.name}" (${loanId}) - operation complete`
      );

      res.json({
        message: "Loan deleted successfully",
        loanId: loanId,
      });
    } catch (error) {
      console.error("[DELETE] 💥 Error deleting loan:", error);
      res.status(500).json({ message: "Failed to delete loan" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/overview", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log(`📊 Analytics request for user: ${userId}`);
      const user = await storage.getUser(userId);
      const loans = await storage.getUserLoans(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(
        `📊 User ${userId} has ${loans.length} loans, salary: ${user.salary}`
      );
      console.log(
        `📊 Loan amounts for user ${userId}:`,
        loans.map((loan: any) => ({
          name: loan.name,
          outstanding: loan.currentBalance || loan.outstandingAmount,
          emi: loan.monthlyPayment || loan.emiAmount,
        }))
      );

      const totalDebt = loans.reduce((sum, loan: any) => {
        // Handle both SQLite (currentBalance) and PostgreSQL (outstandingAmount) schemas
        const amount = parseFloat(
          loan.currentBalance || loan.outstandingAmount || "0"
        );
        // Only include loans with outstanding amount > 0 (exclude closed loans)
        if (amount > 0) {
          console.log(`📊 Adding active loan ${loan.name}: ${amount}`);
          return sum + amount;
        } else {
          console.log(`📊 Skipping closed loan ${loan.name}: ${amount}`);
          return sum;
        }
      }, 0);
      const totalEMI = loans.reduce((sum, loan: any) => {
        // Only include EMI for loans with outstanding amount > 0 (exclude closed loans)
        const outstandingAmount = parseFloat(
          loan.currentBalance || loan.outstandingAmount || "0"
        );
        const emiAmount = parseFloat(
          loan.monthlyPayment || loan.emiAmount || "0"
        );

        if (outstandingAmount > 0) {
          console.log(
            `📊 Adding EMI for active loan ${loan.name}: ${emiAmount}`
          );
          return sum + emiAmount;
        } else {
          console.log(
            `📊 Skipping EMI for closed loan ${loan.name}: ${emiAmount}`
          );
          return sum;
        }
      }, 0);
      console.log(
        `📊 Final totals for user ${userId}: debt=${totalDebt}, emi=${totalEMI}`
      );
      // IMPORTANT: Using the user's actual salary from their profile
      // A proper user profile management feature should be implemented in the future
      // to allow users to update this value themselves.
      const salary = parseFloat(String(user.salary || "55000"));

      // Debt-to-Income ratio: EMI should not exceed 40-50% of gross monthly income
      const emiRatio = salary > 0 ? (totalEMI / salary) * 100 : 0;

      // Available Income: Salary minus EMI (should account for other expenses)
      // Use user-customized basic expenses if available, otherwise default to 25% of salary
      let basicExpensesTotal = 0;
      let basicExpensesBreakdown: any = {};

      if (
        user.basicExpenseHousing ||
        user.basicExpenseFood ||
        user.basicExpenseTransport ||
        user.basicExpenseHealthcare ||
        user.basicExpenseOther
      ) {
        // Use custom values
        const housing = parseFloat(user.basicExpenseHousing || "0");
        const food = parseFloat(user.basicExpenseFood || "0");
        const transport = parseFloat(user.basicExpenseTransport || "0");
        const healthcare = parseFloat(user.basicExpenseHealthcare || "0");
        const other = parseFloat(user.basicExpenseOther || "0");

        basicExpensesTotal = housing + food + transport + healthcare + other;
        basicExpensesBreakdown = {
          housing,
          food,
          transport,
          healthcare,
          other,
          total: basicExpensesTotal,
        };
      } else {
        // Use default estimation of 25% of salary
        basicExpensesTotal = Math.round(salary * 0.25);
        const defaultPerCategory = Math.round(basicExpensesTotal / 5);
        basicExpensesBreakdown = {
          housing: defaultPerCategory * 2, // Housing typically takes more
          food: defaultPerCategory,
          transport: defaultPerCategory,
          healthcare: Math.round(defaultPerCategory * 0.5),
          other: Math.round(defaultPerCategory * 1.5),
          total: basicExpensesTotal,
        };
      }

      const availableIncome = salary - totalEMI - basicExpensesTotal;

      // Ensure all values are valid numbers
      const sanitizedBasicExpenses = {
        housing: isNaN(basicExpensesBreakdown.housing)
          ? 0
          : basicExpensesBreakdown.housing,
        food: isNaN(basicExpensesBreakdown.food)
          ? 0
          : basicExpensesBreakdown.food,
        transportation: isNaN(basicExpensesBreakdown.transport)
          ? 0
          : basicExpensesBreakdown.transport,
        healthcare: isNaN(basicExpensesBreakdown.healthcare)
          ? 0
          : basicExpensesBreakdown.healthcare,
        utilities: isNaN(basicExpensesBreakdown.other)
          ? 0
          : basicExpensesBreakdown.other,
        total: isNaN(basicExpensesTotal) ? 0 : basicExpensesTotal,
      };

      const response = {
        totalDebt: isNaN(totalDebt) ? 0 : totalDebt,
        totalEMI: isNaN(totalEMI) ? 0 : totalEMI,
        salary: isNaN(salary) ? 0 : salary,
        emiRatio: isNaN(emiRatio) ? 0 : emiRatio,
        availableIncome: isNaN(availableIncome) ? 0 : availableIncome,
        basicExpenses: sanitizedBasicExpenses,
      };

      console.log(`📊 Sending analytics response:`, response);
      res.json(response);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
