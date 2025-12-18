import { z } from "zod"

/**
 * Common validation schemas
 */
export const emailSchema = z.string().email("Invalid email address")

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const displayNameSchema = z
  .string()
  .min(2, "Display name must be at least 2 characters")
  .max(50, "Display name must be less than 50 characters")
  .regex(/^[a-zA-Z0-9\s]+$/, "Display name can only contain letters, numbers, and spaces")

export const bioSchema = z
  .string()
  .max(1000, "Bio must be less than 1000 characters")
  .optional()

export const ageSchema = z
  .number()
  .int("Age must be a whole number")
  .min(18, "Must be at least 18 years old")
  .max(100, "Invalid age")
  .optional()

export const rateSchema = z
  .number()
  .positive("Rate must be positive")
  .max(10000, "Rate too high")
  .optional()

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  try {
    emailSchema.parse(email)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message }
    }
    return { valid: false, error: "Invalid email" }
  }
}

