"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helpers_service_1 = require("../helpers/helpers.service");
let AuthService = class AuthService {
    constructor(prisma, helpers) {
        this.prisma = prisma;
        this.helpers = helpers;
    }
    async signUp(body) {
        let userInDb = await this.prisma.user.findUnique({
            where: {
                username: body.username,
            },
        });
        if (userInDb) {
            throw new common_1.BadRequestException('user details already exists');
        }
        userInDb = await this.prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        if (userInDb) {
            throw new common_1.BadRequestException('user details already exists');
        }
        const data = {
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
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!(user && (await this.helpers.verifyPassword(password, user.password)))) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        return user;
    }
    async login(body) {
        const user = await this.validateUser(body.email, body.password);
        const accessToken = await this.helpers.createAccessToken(user);
        const refreshToken = await this.helpers.createRefreshToken(user);
        return {
            accessToken,
            refreshToken,
        };
    }
    async refresh(token) {
        const userId = await this.helpers.verifyRefreshToken(token);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const accessToken = await this.helpers.createAccessToken(user);
        const refreshToken = await this.helpers.createRefreshToken(user);
        return {
            accessToken,
            refreshToken,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, helpers_service_1.HelpersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map