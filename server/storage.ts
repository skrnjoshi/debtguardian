import {
  users,
  loans,
  payments,
  type User,
  type UpsertUser,
  type Loan,
  type InsertLoan,
  type Payment,
  type InsertPayment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Loan operations
  getUserLoans(userId: string): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoan(id: string, updates: Partial<Loan>): Promise<Loan>;
  getLoan(id: string): Promise<Loan | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getUserPayments(userId: string, limit?: number): Promise<Payment[]>;
  getLoanPayments(userId: string, loanId: string): Promise<Payment[]>;
  
  // Initialize user with default loans
  initializeUserLoans(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Loan operations
  async getUserLoans(userId: string): Promise<Loan[]> {
    return await db
      .select()
      .from(loans)
      .where(eq(loans.userId, userId))
      .orderBy(desc(loans.interestRate));
  }

  async createLoan(loan: InsertLoan): Promise<Loan> {
    const [newLoan] = await db.insert(loans).values(loan).returning();
    return newLoan;
  }

  async updateLoan(id: string, updates: Partial<Loan>): Promise<Loan> {
    const [updatedLoan] = await db
      .update(loans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(loans.id, id))
      .returning();
    return updatedLoan;
  }

  async getLoan(id: string): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan;
  }

  async updateLoanDetails(loanId: string, userId: string, updates: {
    name: string;
    loanType: string;
    emiAmount: string;
    interestRate: string;
    remainingMonths: number;
  }): Promise<Loan> {
    const [loan] = await db
      .update(loans)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(loans.id, loanId), eq(loans.userId, userId)))
      .returning();
    return loan;
  }

  async getLoanPayments(userId: string, loanId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(and(eq(payments.userId, userId), eq(payments.loanId, loanId)))
      .orderBy(desc(payments.paymentDate));
  }

  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getUserPayments(userId: string, limit = 10): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.paymentDate))
      .limit(limit);
  }



  // Initialize user with default loans based on the provided data
  async initializeUserLoans(userId: string): Promise<void> {
    const defaultLoans = [
      {
        userId,
        name: "Credit Card 1",
        loanType: "credit_card",
        originalAmount: "250000.00",
        outstandingAmount: "193221.00",
        emiAmount: "10853.00",
        interestRate: "13.00",
        remainingMonths: 19,
        nextDueDate: new Date("2025-01-15"),
      },
      {
        userId,
        name: "Credit Card 2",
        loanType: "credit_card", 
        originalAmount: "120000.00",
        outstandingAmount: "81560.00",
        emiAmount: "2396.00",
        interestRate: "18.00",
        remainingMonths: 48,
        nextDueDate: new Date("2025-01-20"),
      },
      {
        userId,
        name: "Credit Card 3",
        loanType: "credit_card",
        originalAmount: "450000.00",
        outstandingAmount: "300913.00",
        emiAmount: "10142.00",
        interestRate: "18.00",
        remainingMonths: 37,
        nextDueDate: new Date("2025-01-18"),
      },
      {
        userId,
        name: "Credit Card 4",
        loanType: "credit_card",
        originalAmount: "35000.00",
        outstandingAmount: "17745.00",
        emiAmount: "2354.00",
        interestRate: "0.00",
        remainingMonths: 8,
        nextDueDate: new Date("2025-01-10"),
      },
      {
        userId,
        name: "Fibe",
        loanType: "personal",
        originalAmount: "250000.00",
        outstandingAmount: "143978.00",
        emiAmount: "11181.00",
        interestRate: "33.00",
        remainingMonths: 15,
        nextDueDate: new Date("2025-01-25"),
      },
      {
        userId,
        name: "Moneyview",
        loanType: "personal",
        originalAmount: "150000.00",
        outstandingAmount: "61468.00",
        emiAmount: "6169.00",
        interestRate: "33.00",
        remainingMonths: 12,
        nextDueDate: new Date("2025-01-22"),
      },
      {
        userId,
        name: "L&T Finance",
        loanType: "personal",
        originalAmount: "500000.00",
        outstandingAmount: "359616.00",
        emiAmount: "11806.00",
        interestRate: "18.00",
        remainingMonths: 41,
        nextDueDate: new Date("2025-01-28"),
      },
      {
        userId,
        name: "Car Loan",
        loanType: "vehicle",
        originalAmount: "600000.00",
        outstandingAmount: "368408.00",
        emiAmount: "14585.00",
        interestRate: "8.25",
        remainingMonths: 41,
        nextDueDate: new Date("2025-01-12"),
      },
    ];

    for (const loan of defaultLoans) {
      await this.createLoan(loan);
    }
  }
}

export const storage = new DatabaseStorage();
