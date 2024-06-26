import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { stringSchema } from 'src/shared/schemas.shared';

export const confirmEmailSchema = z.object({
  token: stringSchema.regex(
    /^[A-Za-z0-9-_]+?\.[A-Za-z0-9-_]+?\.[A-Za-z0-9-_]+?$/,
  ),
});

export type ConfirmEmailPayload = z.infer<typeof confirmEmailSchema>;

export class ConfirmEmailDTO extends createZodDto(confirmEmailSchema) {
  @ApiProperty({
    description: 'Token',
  })
  token: string;
}
