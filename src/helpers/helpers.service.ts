import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HelpersService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  public async hashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  public async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon.verify(hashedPassword, plainPassword);
  }

  public async createAccessToken(user: User) {
    const toEncode = {
      sub: user.id,
      scope: 'access_token',
    };

    return this.jwtService.signAsync(toEncode, {
      expiresIn: '30s',
    });
  }

  public async createRefreshToken(user: User) {
    const toEncode = {
      sub: user.id,
      scope: 'refresh_token',
    };

    return this.jwtService.signAsync(toEncode, {
      expiresIn: '90d',
    });
  }

  public async verifyRefreshToken(token: string): Promise<string> {
    // Check if token has been used
    const usedToken = await this.prisma.usedToken.findUnique({
      where: { tokenId: token },
    });

    if (usedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = this.jwtService.verify(token, {
      issuer: 'revolution',
      algorithms: ['HS256'],
    });

    if (!(payload['scope'] === 'refresh_token')) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.prisma.usedToken.create({ data: { tokenId: token } });

    return payload['sub'];
  }
}
