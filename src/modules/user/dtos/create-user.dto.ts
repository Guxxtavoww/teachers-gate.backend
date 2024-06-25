import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  emailStringSchema,
  optionalStringSchema,
  stringSchema,
} from 'src/shared/schemas.shared';

import { userTypeSchema } from './user-type.schema';

export const createUserSchema = z.object({
  user_name: stringSchema,
  user_email: emailStringSchema,
  user_type: userTypeSchema,
  password: optionalStringSchema,
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;

export class CreateUserDTO extends createZodDto(createUserSchema) {}
