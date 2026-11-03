/** Fixed-window in-memory rate limiter (LEAD-15). For multi-instance deployments swap for a shared store (see INTEGRATIONS.md). */
const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60_000, now = Date.now()) {
  const b = buckets.get(key)
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }
  b.count++
  if (buckets.size > 10_000) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k)
  return { ok: b.count <= limit, remaining: Math.max(0, limit - b.count) }
}
export const resetRateLimits = () => buckets.clear()
