/* eslint-disable @typescript-eslint/ban-types */
import type { IPaginationOptions } from 'nestjs-typeorm-paginate';

import type { UserTypeEnum } from 'src/modules/user/enums/user-type.enum';
import type { UserAuthProviders } from 'src/modules/user/enums/user-auth-providers.enum';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvType {}
  }

  export type DeepPartial<T> = T extends Function
    ? T
    : T extends Array<infer InferredArrayMember>
      ? DeepPartialArray<InferredArrayMember>
      : T extends object
        ? DeepPartialObject<T>
        : Maybe<T>;

  export type DeepPartialObject<T> = {
    [K in keyof T]?: DeepPartial<T[K]>;
  };

  export interface DeepPartialArray<T> extends Array<DeepPartial<T>> {}

  export type NullableValue<T> = T | null;

  export type Maybe<T> = NullableValue<T> | undefined;

  export interface IJwtPayload {
    id: string;
    email: string;
    name: string;
    user_type: UserTypeEnum;
    user_auth_provider: UserAuthProviders;
  }

  export type DecodedTokenType = IJwtPayload & {
    iat: number;
    exp: number;
  };

  export type PaginationArgs<T extends Record<string, any> = object> = T &
    Omit<IPaginationOptions, 'limit' | 'page'> & {
      limit?: string | number;
      page?: string | number;
    };
}
