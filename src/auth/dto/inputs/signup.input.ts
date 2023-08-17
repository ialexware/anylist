import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType() // this is a decorator that tells graphql that this is an input type
export class SignUpInput {
  @Field(() => String) // this is a decorator that tells graphql that this is a field
  @IsEmail()
  email: string;
  @Field(() => String)
  @IsNotEmpty()
  fullName: string;
  @Field(() => String)
  @MinLength(6)
  password: string;
}
