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
exports.HelpersService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon = require("argon2");
const prisma_service_1 = require("../prisma/prisma.service");
let HelpersService = class HelpersService {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async hashPassword(password) {
        return argon.hash(password);
    }
    async verifyPassword(plainPassword, hashedPassword) {
        return argon.verify(hashedPassword, plainPassword);
    }
    async createAccessToken(user) {
        const toEncode = {
            sub: user.id,
            scope: 'access_token',
        };
        return this.jwtService.signAsync(toEncode, {
            expiresIn: '30s',
        });
    }
    async createRefreshToken(user) {
        const toEncode = {
            sub: user.id,
            scope: 'refresh_token',
        };
        return this.jwtService.signAsync(toEncode, {
            expiresIn: '90d',
        });
    }
    async verifyRefreshToken(token) {
        const usedToken = await this.prisma.usedToken.findUnique({
            where: { tokenId: token },
        });
        if (usedToken) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const payload = this.jwtService.verify(token, {
            issuer: 'revolution',
            algorithms: ['HS256'],
        });
        if (!(payload['scope'] === 'refresh_token')) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        await this.prisma.usedToken.create({ data: { tokenId: token } });
        return payload['sub'];
    }
};
HelpersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, prisma_service_1.PrismaService])
], HelpersService);
exports.HelpersService = HelpersService;
//# sourceMappingURL=helpers.service.js.map