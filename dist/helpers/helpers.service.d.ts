import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class HelpersService {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    hashPassword(password: string): Promise<string>;
    verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    createAccessToken(user: User): Promise<string>;
    createRefreshToken(user: User): Promise<string>;
    verifyRefreshToken(token: string): Promise<string>;
}
