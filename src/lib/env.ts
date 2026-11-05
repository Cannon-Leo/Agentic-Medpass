import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  GROQ_API_KEY: z.string().min(1),
  CEREBRAS_API_KEY: z.string().min(1),
  WHATSAPP_API_TOKEN: z.string().min(1),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(1),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().min(1),
  TERMII_API_KEY: z.string().min(1),
  PAYSTACK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

// Only validate during server-side execution if environment variables are populated
export function getEnv(): Env {
  return envSchema.parse(process.env);
}

