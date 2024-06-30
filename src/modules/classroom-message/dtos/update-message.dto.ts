import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { optionalStringSchema } from 'src/shared/schemas.shared';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const updateMessageSchema = z.object({
  content: optionalStringSchema,
});

export type UpdateMessagePayload = z.infer<typeof updateMessageSchema>;

export class UpdateMessageDTO extends createZodDto(updateMessageSchema) {
  @ApiPropertyOptional({ type: String })
  content?: string;
}
