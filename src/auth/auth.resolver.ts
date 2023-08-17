import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { SignUpInput, LogInInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signUpInput') signUpInput: SignUpInput, // @Args is a decorator that defines the arguments of a GraphQL mutation or query.
  ): Promise<AuthResponse> {
    return this.authService.signup(signUpInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('logInInput') logInInput: LogInInput,
  ): Promise<AuthResponse> {
    return this.authService.login(logInInput);
  }

  @Query(() => AuthResponse, { name: 'revalite' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser(/**[ValidRoles.ADMIN]**/) user: User,
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
