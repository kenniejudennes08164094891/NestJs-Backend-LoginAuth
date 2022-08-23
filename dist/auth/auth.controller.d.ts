import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(body: SignupDto): Promise<import(".prisma/client").User>;
    login(body: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(body: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(req: any): Promise<any>;
}
