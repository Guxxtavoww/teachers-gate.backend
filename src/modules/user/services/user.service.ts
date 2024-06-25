import { Injectable } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';

import { PaginateUsersPayload } from '../dtos/paginate-users.dto';
import { userRepository } from '../repositorys/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly paginationService: PaginationService) {}

  private createUserQueryBuilder(selectPassword?: boolean) {
    return userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.created_at',
        'user.updated_at',
        'user.user_name',
        'user.user_email',
        'user.user_type',
        selectPassword ? 'user.hashed_password' : '',
      ]);
  }

  async paginateUsers({
    limit,
    page,
    order_by_created_at,
    order_by_updated_at,
    user_name,
    user_type,
  }: PaginateUsersPayload) {
    const queryBuilder = this.createUserQueryBuilder()
      .where(user_name ? 'user.user_name LIKE :user_name' : '1=1', {
        user_name: `%${user_name}%`,
      })
      .andWhere(user_type ? 'user.user_type = :user_type' : '1=1', {
        user_type,
      });

    if (order_by_created_at)
      queryBuilder.orderBy('user.created_at', order_by_created_at);

    if (order_by_updated_at)
      queryBuilder.orderBy('user.updated_at', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(queryBuilder, {
      limit,
      page,
    });
  }
}
