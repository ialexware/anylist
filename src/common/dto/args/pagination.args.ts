import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Number, { nullable: true })
  @Min(0)
  @IsOptional()
  offset = 0;

  @Field(() => Number, { nullable: true })
  @Min(1)
  @IsOptional()
  limit = 10;
}
