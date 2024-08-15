import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../../shared/entity/order.entity";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";
import { OrderController } from "./order.controller";
import { CartRepository } from "../cart/cart.repository";
import { BookRepository } from "../book/book.repository";
import { AuthRepository } from "../authentication/authentication.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [
        OrderService,
        OrderRepository,
        OrderRepository,
        CartRepository,
        BookRepository,
        AuthRepository,
    ],
    controllers: [OrderController],
})
export class OrderModule {}
