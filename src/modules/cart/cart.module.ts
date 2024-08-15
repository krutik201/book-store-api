import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "../../shared/entity/cart.entity";
import { CartRepository } from "./cart.repository";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { AuthRepository } from "../authentication/authentication.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Cart])],
    providers: [CartService, CartRepository, AuthRepository],
    controllers: [CartController],
})
export class CartModule {}
