import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import { env } from '../../config/environment';

// Create Redis store
const RedisStore = connectRedis(session);

// Session configuration
export const sessionConfig = {
  store: new RedisStore({
    client: redis,
    ttl: env.REDIS_SESSION_TTL, // TTL in seconds
    prefix: 'session:',
    disableTouch: false,
  }),
  name: 'tixgenius.sid',
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Force session identifier cookie to be set on every response
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === 'production', // Only use secure cookies in production
    sameSite: 'lax' as const,
    maxAge: env.REDIS_SESSION_TTL * 1000, // MaxAge in milliseconds
  },
};

// Session middleware
export const sessionMiddleware = session(sessionConfig);

// Function to clear a user's session
export const clearUserSession = async (userId: string): Promise<void> => {
  const sessionPattern = `session:*`;
  const keys = await redis.keys(sessionPattern);
  
  // Get all sessions and check if they belong to the user
  for (const key of keys) {
    try {
      const sessionData = await redis.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.userId === userId) {
          await redis.del(key);
        }
      }
    } catch (err) {
      console.error(`Failed to parse session data for key ${key}`, err);
    }
  }
}; 