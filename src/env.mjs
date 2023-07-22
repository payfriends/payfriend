import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

/**
 * Specify your environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
export const env = createEnv({
  clientPrefix: "NEXT_PUBLIC_",
  server: {
    VERCEL_URL: z.string().url().optional(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    SENDGRID_API_KEY: z.string().min(1),
    SENDGRID_FROM_EMAIL: z.string().email(),
    SENDGRID_SANDBOX_MODE: z.coerce.boolean().optional().default(false),
    REDIS_URL: z.string().min(1),
    TWILIO_ACCOUNT_SID: z.string().min(1),
    TWILIO_AUTH_TOKEN: z.string().min(1),
    TWILIO_FROM_WHATSAPP_NUMBER: z.string().startsWith("whatsapp:"),
    TWILIO_DEV_TO_WHATSAPP_NUMBER: z
      .string()
      .startsWith("whatsapp:")
      .optional(),
    WOMPI_PUBLIC_KEY: z.string().min(1),
    WOMPI_PRIVATE_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    SENDGRID_SANDBOX_MODE: process.env.SENDGRID_SANDBOX_MODE,
    REDIS_URL: process.env.REDIS_URL,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_FROM_WHATSAPP_NUMBER: process.env.TWILIO_FROM_WHATSAPP_NUMBER,
    TWILIO_DEV_TO_WHATSAPP_NUMBER: process.env.TWILIO_DEV_TO_WHATSAPP_NUMBER,
    WOMPI_PUBLIC_KEY: process.env.WOMPI_PUBLIC_KEY,
    WOMPI_PRIVATE_KEY: process.env.WOMPI_PRIVATE_KEY,
  },
});
