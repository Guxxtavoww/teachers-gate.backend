import 'dotenv/config';
import { z } from 'nestjs-zod/z';

import {
  stringSchema,
  optionalStringSchema,
  optionalStringToNumberSchema,
  emailStringSchema,
  optionalUrlStringSchema,
} from 'src/shared/schemas.shared';

export const envSchema = z.object({
  DATABASE_ROOT_PASSWORD: stringSchema,
  DATABASE_DATABASE_NAME: stringSchema,
  DB_PORT: optionalStringToNumberSchema.default('5432'),
  DATABASE_HOST: optionalStringSchema.default('localhost'),
  DB_USER: stringSchema,
  JWT_SECRET: stringSchema,
  JWT_EXPIRES_IN: stringSchema,
  PORT: optionalStringToNumberSchema.default('5000'),
  WEBSOCKET_PORT: optionalStringToNumberSchema.default('80'),
  ENV: z.enum(['prod', 'dev']).default('dev'),
  RESEND_API_KEY: stringSchema,
  EMAIL_FROM: emailStringSchema,
  EMAIL_CONFIRMATION_URL: optionalUrlStringSchema.default(
    'http://localhost:3000/user/confirm-email',
  ),
});

export type EnvType = z.infer<typeof envSchema>;

export const ENV_VARIABLES = envSchema.parse(process.env);
