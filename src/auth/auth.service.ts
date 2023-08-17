import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { SignUpInput, LogInInput } from './dto/inputs';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtTken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signUpInput: SignUpInput): Promise<AuthResponse> {
    // Create user
    const user = await this.usersService.create(signUpInput);

    // Create JWT token
    const token = this.getJwtTken(user.id);

    return {
      token: token,
      user: user,
    };
  }

  async login(logInInput: LogInInput): Promise<AuthResponse> {
    const { email, password } = logInInput;
    const user = await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    // Create JWT token
    const token = this.getJwtTken(user.id);
    return {
      token: token,
      user: user,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.usersService.findOneById(userId);
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    delete user.password;
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtTken(user.id);
    return {
      token: token,
      user: user,
    };
  }
}
