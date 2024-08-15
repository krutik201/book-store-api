import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./authentication.controller";
import { AuthService } from "./authentication.service";
import { AuthRepository } from "./authentication.repository";
import { User } from "../../shared/entity/user.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, JwtService],
})
export class AuthModule {}
