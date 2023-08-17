import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType() // this is a decorator that tells nestjs that this is a graphql object type
export class AuthResponse {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
}
