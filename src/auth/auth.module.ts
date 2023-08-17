import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtSrategy } from './strategies/jwt.strategy';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [AuthResolver, AuthService, JwtSrategy],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '4h',
        },
      }),
    }),
    UsersModule,
  ],
  exports: [JwtSrategy, PassportModule, JwtModule],
})
export class AuthModule {}
