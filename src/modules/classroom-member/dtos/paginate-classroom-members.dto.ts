import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { uuidSchema } from 'src/shared/schemas.shared';
import { createPaginationSchema } from 'src/utils/create-pagination-schema.util';

export const paginateClassroomMembersSchema = createPaginationSchema({
  classroom_id: uuidSchema,
});

export type PaginateClassroomMembersPayload = z.infer<
  typeof paginateClassroomMembersSchema
>;

export class PaginateClassroomMembersDTO extends createZodDto(
  paginateClassroomMembersSchema,
) {
  @ApiProperty({ type: String })
  classroom_id: string;
}
