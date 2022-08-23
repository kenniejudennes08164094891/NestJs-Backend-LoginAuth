import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { HelpersService } from '../helpers/helpers.service';
export declare class AuthService {
    private prisma;
    private helpers;
    constructor(prisma: PrismaService, helpers: HelpersService);
    signUp(body: SignupDto): Promise<User>;
    validateUser(email: string, password: string): Promise<User>;
    login(body: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
