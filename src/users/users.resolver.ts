import { UpdateUserInput } from './dto/update-user.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from 'src/items/dto/args/roles.arg';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User[]> {
    console.log(validRoles);

    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Args('user') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) currentUser: User,
  ): Promise<User> {
    return this.usersService.updateUser(updateUserInput, currentUser);
  }

  @Mutation(() => User, { name: 'blockUser' })
  @UseGuards(JwtAuthGuard)
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User> {
    return this.usersService.blockUser(id, user);
  }
}
