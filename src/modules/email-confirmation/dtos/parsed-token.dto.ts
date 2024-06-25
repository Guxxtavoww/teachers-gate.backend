import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { emailStringSchema } from 'src/shared/schemas.shared';

export const parsedTokenSchema = z.object({
  user_email: emailStringSchema,
});

export type ParsedTokenPayload = z.infer<typeof parsedTokenSchema>;

export class ParsedTokenDTO extends createZodDto(parsedTokenSchema) {}
