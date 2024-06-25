import { z } from 'nestjs-zod/z';

import { createNullableTransform } from 'src/utils/create-nullable-transform.util';

import { UserTypeEnum } from '../enums/user-type.enum';

export const userTypeSchema = z.nativeEnum(UserTypeEnum);

export const optionalUserTypeSchema = createNullableTransform(userTypeSchema);
