import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { uuidSchema } from 'src/shared/schemas.shared';
import { createPaginationSchema } from 'src/utils/create-pagination-schema.util';

export const paginateClassroomChatMessages = createPaginationSchema({
  classroom_chat_id: uuidSchema,
});

export type PaginateClassroomChatMessagesPayload = z.infer<
  typeof paginateClassroomChatMessages
>;

export class PaginateClassroomChatMessagesDTO extends createZodDto(
  paginateClassroomChatMessages,
) {
  @ApiProperty({ type: String, description: 'Classroom chat id' })
  classroom_chat_id: string;
}
