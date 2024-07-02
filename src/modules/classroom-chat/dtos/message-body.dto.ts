import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { stringSchema, uuidSchema } from 'src/shared/schemas.shared';

export const messsageBodySchema = z.object({
  content: stringSchema,
  classroom_chat_id: uuidSchema,
  user_id: uuidSchema,
});

export type MessageBodyPayload = z.infer<typeof messsageBodySchema>;

export class MessageBodyDTO extends createZodDto(messsageBodySchema) {}
