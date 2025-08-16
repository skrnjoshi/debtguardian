import { db, currentSchema } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Extract schema objects
const { users, loans, payments } = currentSchema;

// Types - use the SQLite schema types for consistency
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Loan = typeof loans.$inferSelect;
export type InsertLoan = typeof loans.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(userId: string, updates: Partial<User>): Promise<User>;
  validatePassword(email: string, password: string): Promise<User | null>;

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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async validatePassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const bcrypt = await import("bcryptjs");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
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

  async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
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
    console.log("🏗️ Creating loan with data:", loan);
    try {
      const [newLoan] = await db.insert(loans).values(loan).returning();
      console.log("✅ Loan created successfully:", newLoan);
      return newLoan;
    } catch (error) {
      console.error("❌ Error creating loan:", error);
      throw error;
    }
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

  async updateLoanDetails(
    loanId: string,
    userId: string,
    updates: {
      name: string;
      loanType: string;
      emiAmount: string;
      interestRate: string;
      remainingMonths: number;
    }
  ): Promise<Loan> {
    console.log(`[STORAGE] 📝 Updating loan ${loanId} for user ${userId}`);
    console.log(`[STORAGE] 📊 Original updates:`, updates);

    // Use PostgreSQL schema field names
    const mappedUpdates = {
      name: updates.name,
      loanType: updates.loanType,
      emiAmount: updates.emiAmount, // Keep same name as PostgreSQL schema
      interestRate: parseFloat(updates.interestRate),
      remainingMonths: updates.remainingMonths, // Keep same name as PostgreSQL schema
      updatedAt: new Date(),
    };

    console.log(`[STORAGE] 🔄 Mapped updates for PostgreSQL:`, mappedUpdates);

    const [loan] = await db
      .update(loans)
      .set(mappedUpdates)
      .where(and(eq(loans.id, loanId), eq(loans.userId, userId)))
      .returning();

    console.log(`[STORAGE] ✅ Updated loan result:`, loan);
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

  // Flexible loan update method for closing loans
  async updateLoanPartial(
    loanId: string,
    userId: string,
    updates: Partial<{
      outstandingAmount: number; // Use PostgreSQL field name
      remainingMonths: number; // Use PostgreSQL field name
      name: string;
      loanType: string;
      emiAmount: number; // Use PostgreSQL field name
      interestRate: number;
    }>
  ): Promise<Loan> {
    console.log(`[STORAGE] 🔄 Partial update for loan ${loanId}:`, updates);

    const [loan] = await db
      .update(loans)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(loans.id, loanId), eq(loans.userId, userId)))
      .returning();

    console.log(`[STORAGE] ✅ Partial update result:`, loan);
    return loan;
  }

  // Delete loan method
  async deleteLoan(loanId: string, userId: string): Promise<void> {
    // First delete all payments for this loan
    await db
      .delete(payments)
      .where(and(eq(payments.loanId, loanId), eq(payments.userId, userId)));

    // Then delete the loan itself
    await db
      .delete(loans)
      .where(and(eq(loans.id, loanId), eq(loans.userId, userId)));
  }

  // Initialize user with no default loans - users start with a clean slate
  async initializeUserLoans(userId: string): Promise<void> {
    // No longer create default loans - let users add their own
    // This prevents the confusion where all users appeared to have the same data
    console.log(`🏠 User ${userId} initialized with empty loan portfolio`);
  }
}

export const storage = new DatabaseStorage();
