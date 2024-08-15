import { DataSource, Repository } from "typeorm";
import { Cart } from "../../shared/entity/cart.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Order } from "../../shared/entity/order.entity";
import { OrderItem } from "../../shared/entity/order-item.entity";
import { throwException } from "../../shared/utility/throw-exception";
import { onErrorResumeNext } from "rxjs";

@Injectable()
export class OrderRepository extends Repository<Order> {
    constructor(readonly dataSource: DataSource) {
        super(Order, dataSource.createEntityManager());
    }

    async createOrder(userId, totalAmount) {
        const order = this.create({
            user: { id: userId },
            totalAmount,
            status: "pending" /* initial keeping in pending */,
        });
        return await this.save(order);
    }

    async findOrderById(orderId) {
        return await this.findOne({
            where: { id: orderId },
            relations: ["items", "items.book"],
        });
    }

    async createOrderItems(order: Order, items: any[]): Promise<OrderItem[]> {
        try {
            const orderItems = items.map((item) =>
                OrderItem.create({
                    order,
                    book: { id: item.book.id },
                    quantity: item.quantity,
                    perItemPrice: item.book.price,
                })
            );
            return await OrderItem.save(orderItems);
        } catch (error) {
            throwException(error);
        }
    }

    async findOrdersByUserId(userId): Promise<any> {
        try {
            return await this.find({
                where: { user: { id: userId } },
                relations: ["items", "items.book"],
                order: { createdAt: "DESC" },
            });
        } catch (error) {
            throwException(error);
        }
    }
}
