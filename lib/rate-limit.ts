// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitOptions {
  interval: number // Time window in milliseconds
  maxRequests: number // Max requests per interval
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { interval: 60 * 1000, maxRequests: 10 }
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    // Create new record
    const resetTime = now + options.interval
    rateLimitMap.set(identifier, { count: 1, resetTime })
    
    // Cleanup old entries periodically
    if (rateLimitMap.size > 1000) {
      for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
          rateLimitMap.delete(key)
        }
      }
    }

    return { success: true, remaining: options.maxRequests - 1, resetTime }
  }

  if (record.count >= options.maxRequests) {
    return { success: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return {
    success: true,
    remaining: options.maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Get client IP from request
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const realIP = req.headers.get("x-real-ip")
  return forwarded?.split(",")[0] || realIP || "unknown"
}

