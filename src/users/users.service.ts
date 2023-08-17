import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignUpInput } from 'src/auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { ValidRolesArgs } from 'src/items/dto/args/roles.arg';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signUpInput,
        // Crypting password before saving it to the database using bcrypt
        password: bcrypt.hashSync(signUpInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(validRoles: ValidRoles[]): Promise<User[]> {
    if (validRoles.length === 0) {
      return await this.userRepository.find();
    } else {
      return await this.userRepository
        .createQueryBuilder()
        .andWhere('ARRAY[roles] && ARRAY[:...roles]')
        .setParameter('roles', validRoles)
        .getMany();
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-user-not-found',
        detail: `${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-user-not-found',
        detail: `${id} not found`,
      });
    }
  }

  async blockUser(id: string, userWhoUpdated: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = userWhoUpdated;
    return await this.userRepository.save(userToBlock);
  }

  async updateUser(updateUser: UpdateUserInput, userWhoUpdated: User) {
    const findUser = await this.userRepository.preload({ ...updateUser });
    if (!findUser) throw new NotFoundException(`User not found`);
    findUser.lastUpdateBy = userWhoUpdated;

    return await this.userRepository.save(findUser);
  }

  private handleDBErrors(error: any): never {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    } else if (error.code === 'error-user-not-found') {
      throw new NotFoundException(error.detail);
    } else {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
