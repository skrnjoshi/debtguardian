import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User storage table for JWT Auth
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  email: text("email").unique(),
  password: text("password"), // For JWT authentication
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  salary: real("salary").default(55000),
  // Basic expense categories - customizable by user
  basicExpenseHousing: real("basic_expense_housing"), // rent, mortgage, utilities
  basicExpenseFood: real("basic_expense_food"), // groceries, dining
  basicExpenseTransport: real("basic_expense_transport"), // fuel, public transport
  basicExpenseHealthcare: real("basic_expense_healthcare"), // insurance, medical
  basicExpenseOther: real("basic_expense_other"), // other essential expenses
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Loans table
export const loans = sqliteTable("loans", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  principalAmount: real("principal_amount").notNull(),
  currentBalance: real("current_balance").notNull(),
  interestRate: real("interest_rate").notNull(),
  monthlyPayment: real("monthly_payment").notNull(),
  termLength: integer("term_length").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  dueDate: integer("due_date", { mode: "timestamp" }),
  status: text("status").default("active"),
  loanType: text("loan_type").default("personal"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Payments table
export const payments = sqliteTable("payments", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  loanId: text("loan_id")
    .notNull()
    .references(() => loans.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  paymentDate: integer("payment_date", { mode: "timestamp" }).notNull(),
  paymentType: text("payment_type").default("regular"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  loans: many(loans),
  payments: many(payments),
}));

export const loansRelations = relations(loans, ({ one, many }) => ({
  user: one(users, {
    fields: [loans.userId],
    references: [users.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  loan: one(loans, {
    fields: [payments.loanId],
    references: [loans.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const createUserSchema = createInsertSchema(users);
export const createLoanSchema = createInsertSchema(loans);
export const createPaymentSchema = createInsertSchema(payments);

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Loan = typeof loans.$inferSelect;
export type NewLoan = typeof loans.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
