import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { UploadThingError } from "uploadthing/server";

type RateLimitContext =
  | "uploader"
  | "chat";

export async function rateLimit({
  id,
  context = "uploader",
  limit = 10,
  timeframe = 60, // in seconds
}: {
  id: string;
  context?: RateLimitContext;
  limit?: number;
  timeframe?: number;
}) {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, `${timeframe}s`),
    analytics: true,
    prefix: `${context}/ratelimit`, 
  });

  const { success, limit: rateLimitInfo, reset, remaining } = await ratelimit.limit(id);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    throw new UploadThingError(
      `Rate limit exceeded in "${context}". Try again in ${retryAfter}s. Remaining: ${remaining}/${rateLimitInfo}`
    );
  }

  return { success, remaining, limit: rateLimitInfo };
}
