import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { stringSchema } from 'src/shared/schemas.shared';

export const createMessageSchema = z.object({
  content: stringSchema,
});

export type CreateMessagePayload = z.infer<typeof createMessageSchema>;

export class CreateMessageDTO extends createZodDto(createMessageSchema) {
  @ApiProperty({
    type: String,
  })
  content: string;
}
