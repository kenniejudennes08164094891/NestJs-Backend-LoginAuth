"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpersModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const helpers_service_1 = require("./helpers.service");
const prisma_module_1 = require("../prisma/prisma.module");
let HelpersModule = class HelpersModule {
};
HelpersModule = __decorate([
    (0, common_1.Module)({
        providers: [helpers_service_1.HelpersService],
        exports: [helpers_service_1.HelpersService],
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.getOrThrow('SECRET_KEY'),
                    signOptions: {
                        algorithm: 'HS256',
                        issuer: 'revolution',
                    },
                }),
            }),
            prisma_module_1.PrismaModule,
        ],
    })
], HelpersModule);
exports.HelpersModule = HelpersModule;
//# sourceMappingURL=helpers.module.js.map