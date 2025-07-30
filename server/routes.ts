import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPaymentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/initialize-user', isAuthenticated, async (req: any, res) => {
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

  // Loans routes
  app.get('/api/loans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const loans = await storage.getUserLoans(userId);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching loans:", error);
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  // Payments routes
  app.post('/api/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const paymentData = insertPaymentSchema.parse({
        ...req.body,
        userId,
      });

      // Create payment
      const payment = await storage.createPayment(paymentData);

      // Update loan outstanding amount
      const loan = await storage.getLoan(paymentData.loanId);
      if (loan) {
        const newOutstanding = Math.max(0, parseFloat(loan.outstandingAmount) - paymentData.amount);
        await storage.updateLoan(paymentData.loanId, {
          outstandingAmount: newOutstanding.toString(),
        });
      }

      res.json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create payment" });
      }
    }
  });

  app.get('/api/payments/recent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payments = await storage.getUserPayments(userId, 10);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching recent payments:", error);
      res.status(500).json({ message: "Failed to fetch recent payments" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/overview', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const loans = await storage.getUserLoans(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const totalDebt = loans.reduce((sum, loan) => sum + parseFloat(loan.outstandingAmount), 0);
      const totalEMI = loans.reduce((sum, loan) => sum + parseFloat(loan.emiAmount), 0);
      const salary = parseFloat(user.salary || "55000");
      const emiRatio = (totalEMI / salary) * 100;
      const availableIncome = salary - totalEMI;

      res.json({
        totalDebt,
        totalEMI,
        salary,
        emiRatio,
        availableIncome,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
