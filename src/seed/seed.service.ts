import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException(
        "You can't seed the database in production",
      );
    }

    // Cleen the database
    // Delete all the users
    // Delete all the items
    this.deleteRegistry();

    // Create the users
    const users = await this.loadUsers();
    // Create the items

    for (const user of users) {
      await this.LoadItemsPerUser(user);
    }
    return true;
  }

  async deleteRegistry(): Promise<boolean> {
    // Delete Items
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    // Delete Users
    await this.userRepository.createQueryBuilder().delete().where({}).execute();

    return true;
  }

  async loadUsers(): Promise<User[]> {
    const users: User[] = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users;
  }

  async LoadItemsPerUser(user: User): Promise<boolean> {
    const itemPromises = [];
    // Create the items

    for (const item of SEED_ITEMS) {
      itemPromises.push(this.itemsService.create(item, user));
    }

    await Promise.all(itemPromises);

    return true;
  }
}
