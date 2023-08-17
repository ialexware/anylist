import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    const user: User = ctx.req.user;
    if (!user) {
      throw new InternalServerErrorException(
        'User not found in context, make sure to add AuthGuard to your resolver',
      );
    }
    if (roles.length === 0) {
      return user;
    }

    // TODO: check if user has role
    for (const role of user.roles) {
      if (roles.includes(role as ValidRoles)) {
        return user;
      }
    }

    throw new ForbiddenException(
      `${user.fullName} do not have permission to do that`,
    );
  },
);
