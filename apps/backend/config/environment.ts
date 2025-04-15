import 'dotenv/config';
import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'staging', 'test']).default('development'),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // Server
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('0.0.0.0'),
  
  // Auth
  JWT_SECRET: z.string().min(32).default(() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is required in production');
    }
    return 'default-jwt-secret-at-least-32-characters';
  }),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().min(32).default(() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('COOKIE_SECRET is required in production');
    }
    return 'default-cookie-secret-at-least-32-chars';
  }),
  SESSION_SECRET: z.string().min(32).default(() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET is required in production');
    }
    return 'default-session-secret-at-least-32-char';
  }),
  
  // Redis
  REDIS_URL: z.string().url(),
  REDIS_SESSION_TTL: z.string().transform(Number).default('86400'), // 24 hours in seconds
  REDIS_CACHE_TTL: z.string().transform(Number).default('3600'),    // 1 hour in seconds
  
  // CORS
  CORS_ORIGIN: z.string().url().or(z.string().regex(/^\*$/)).default('http://localhost:3000'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: z.string().default('15m'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
});

// Parse and validate environment variables
const parseEnvResult = envSchema.safeParse(process.env);

if (!parseEnvResult.success) {
  console.error('❌ Invalid environment variables:', parseEnvResult.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parseEnvResult.data;

// Add environment type checks
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isStaging = env.NODE_ENV === 'staging';
export const isTest = env.NODE_ENV === 'test'; 