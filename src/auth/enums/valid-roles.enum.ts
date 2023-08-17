import { registerEnumType } from '@nestjs/graphql';

// TODO: Implement as graphQL enum
export enum ValidRoles {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_USER = 'superUser',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'Valid roles',
});
