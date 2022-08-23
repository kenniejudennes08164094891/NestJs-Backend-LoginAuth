import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HelpersService } from './helpers.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [HelpersService],
  exports: [HelpersService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('SECRET_KEY'),
        signOptions: {
          algorithm: 'HS256', // ctrl + space for autocomplete
          issuer: 'revolution',
        },
      }),
    }),
    PrismaModule,
  ],
})
export class HelpersModule {}
