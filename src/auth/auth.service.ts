import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { HelpersService } from '../helpers/helpers.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private helpers: HelpersService) {}

  public async signUp(body: SignupDto): Promise<User> {
    // Check if user in db
    let userInDb = await this.prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (userInDb) {
      throw new BadRequestException('user details already exists');
    }

    userInDb = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (userInDb) {
      throw new BadRequestException('user details already exists');
    }

    const data: Prisma.UserCreateInput = {
      email: body.email,
      password: await this.helpers.hashPassword(body.password),
      username: body.username,
    };

    const user = await this.prisma.user.create({
      data,
    });
    delete user.password;

    return user;
  }

  public async validateUser(email: string, password: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (
      !(user && (await this.helpers.verifyPassword(password, user.password)))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  public async login(body: LoginDto) {
    const user = await this.validateUser(body.email, body.password);

    const accessToken = await this.helpers.createAccessToken(user);
    const refreshToken = await this.helpers.createRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refresh(token: string) {
    const userId = await this.helpers.verifyRefreshToken(token);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const accessToken = await this.helpers.createAccessToken(user);
    const refreshToken = await this.helpers.createRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
