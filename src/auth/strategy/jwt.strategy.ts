import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    if (payload['scope'] !== 'access_token') {
      throw new UnauthorizedException('Invalid token');
    }
    const user = this.prisma.user.findUnique({
      where: {
        id: payload['sub'],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    delete (await user).password;
    return user;
  }
}
