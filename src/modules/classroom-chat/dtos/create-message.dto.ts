import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { stringSchema, uuidSchema } from 'src/shared/schemas.shared';

export const createMessageSchema = z.object({
  content: stringSchema,
  classroom_chat_id: uuidSchema,
});

export type CreateMessagePayload = z.infer<typeof createMessageSchema>;

export class CreateMessageDTO extends createZodDto(createMessageSchema) {
  @ApiProperty({
    type: String,
  })
  classroom_chat_id: string;

  @ApiProperty({
    type: String,
  })
  content: string;
}
