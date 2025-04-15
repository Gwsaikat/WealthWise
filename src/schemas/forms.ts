import { z } from "zod";

/**
 * Expense form schema
 * Validates expense data entries with proper constraints
 */
export const expenseFormSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than zero")
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(val => parseFloat(val))),
  category: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "Please provide a valid date",
  }),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(["weekly", "biweekly", "monthly", "quarterly", "yearly"]).optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

/**
 * Income form schema
 * Validates income data entries with proper constraints
 */
export const incomeFormSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than zero")
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(val => parseFloat(val))),
  source: z.string().min(1, "Please enter an income source"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "Please provide a valid date",
  }),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(["weekly", "biweekly", "monthly", "quarterly", "yearly"]).optional(),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;

/**
 * Budget form schema
 * Validates budget creation and updates
 */
export const budgetFormSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  limit: z
    .number()
    .positive("Budget limit must be greater than zero")
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(val => parseFloat(val))),
  period: z.enum(["weekly", "monthly", "yearly"]),
  rollover: z.boolean().default(false),
  notifications: z.boolean().default(true),
  notificationThreshold: z
    .number()
    .min(1, "Threshold must be at least 1%")
    .max(100, "Threshold cannot exceed 100%")
    .optional()
    .nullable(),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;

/**
 * Goal form schema
 * Validates financial goal entries
 */
export const goalFormSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z
    .number()
    .positive("Target amount must be greater than zero")
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(val => parseFloat(val))),
  currentAmount: z
    .number()
    .min(0, "Current amount cannot be negative")
    .or(z.string().regex(/^\d*(\.\d{1,2})?$/).transform(val => parseFloat(val || "0")))
    .default(0),
  targetDate: z.date({
    invalid_type_error: "Please provide a valid date",
  }).optional(),
  category: z.string().min(1, "Please select a category"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  autoContribute: z.boolean().default(false),
  contributionAmount: z
    .number()
    .min(0, "Contribution amount cannot be negative")
    .optional()
    .nullable(),
  contributionFrequency: z.enum(["weekly", "biweekly", "monthly"]).optional().nullable(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

/**
 * Profile form schema
 * Validates user profile data
 */
export const profileFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  currency_preference: z.string().min(1, "Please select a currency"),
  theme_preference: z.enum(["light", "dark", "system"]).default("system"),
  student_status: z.enum(["full_time", "part_time", "not_student"]).optional(),
  income_range: z.enum(["0-15000", "15001-30000", "30001-50000", "50001-75000", "75001-100000", "100001+"]).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/**
 * Login form schema
 * Validates login credentials
 */
export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

/**
 * Signup form schema
 * Validates registration information
 */
export const signupFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>; 