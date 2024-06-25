import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { emailStringSchema, stringSchema } from 'src/shared/schemas.shared';

export const sendEmailSchema = z.object({
  to: emailStringSchema,
  subject: stringSchema,
  message: stringSchema,
});

export class SendEmailDTO extends createZodDto(sendEmailSchema) {}
