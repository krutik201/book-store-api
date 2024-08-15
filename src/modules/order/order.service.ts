import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { BookRepository } from "../book/book.repository";
import { CartRepository } from "../cart/cart.repository";
import { throwException } from "../../shared/utility/throw-exception";
import { AppResponse } from "../../shared/interface/app-response.interface";
import { AuthRepository } from "../authentication/authentication.repository";

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly userRepository: AuthRepository,
        private readonly bookRepository: BookRepository,
        private readonly cartRepository: CartRepository
    ) {}

    /**
     * [@Description: This function for placing order checking stock from the book repository]
     * @param { userId ,addToCartDto}- to add cart details
     * @author: Krutik Shukla
     **/
    async createOrder(createOrderDto, userId): Promise<AppResponse> {
        try {
            /*Extract createOrderDto */
            const { cartId } = createOrderDto;

            /* Authenticate user */
            await this.userRepository.findUserById(userId);

            /*Initialize Total Amount as 0 */
            let totalAmount = 0;

            const cart = await this.cartRepository.findCartById(cartId, userId);

            /* Calculate total price and reduce stock from books */
            for (const item of cart.items) {
                const book = item.book;
                if (book.stock < item.quantity) {
                    throw new ConflictException(`ERR_OUT_OF_STOCK`);
                }

                /* updated Book Stock*/
                await this.bookRepository.updateBookStock(
                    item.bookId,
                    item.quantity
                );

                /* calculate total price  */
                totalAmount += item.quantity * item.book.price;
            }

            /* Create order */
            const order = await this.orderRepository.createOrder(
                userId,
                totalAmount
            );

            /* Create order items */
            await this.orderRepository.createOrderItems(order, cart.items);

            /* Mark the cart as ordered */
            cart.isOrdered = true;
            await this.cartRepository.save(cart);

            return {
                message: "SUC_ORDER_PLACE",
                data: order,
            };
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function for getting the order History]
     * @param { userId}- to add check order details
     * @author: Krutik Shukla
     **/
    async getOrderHistory(userId): Promise<any> {
        try {
            /* Authenticate user */
            await this.userRepository.findUserById(userId);

            const dbOrders =
                await this.orderRepository.findOrdersByUserId(userId);

            const formattedResponse = this.formatResponse(dbOrders);

            return {
                message: "SUC_ORDER_HISTORY",
                data: formattedResponse,
            };
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function for placing for getting orders details]
     * @param { userId, orderId}- to add order details
     * @author: Krutik Shukla
     **/
    async getOrderDetails(userId, orderId): Promise<AppResponse> {
        try {
            /* Authenticate user */
            await this.userRepository.findUserById(userId);

            const dbOrders = await this.orderRepository.findOrderById(orderId);

            const formattedResponse = this.formatResponse(dbOrders, true);

            return {
                message: "SUC_ORDER_DETAIL",
                data: formattedResponse,
            };
        } catch (error) {
            throwException(error);
        }
    }

    /*Format Response for Get Order Detail and History*/
    formatResponse(response: any, isSingleOrder = false): any {
        const formatOrder = (order: any) => ({
            id: order.id,
            totalAmount: order.totalAmount,
            status: order.status,
            orderDate: order.createdAt,
            items: order.items.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                perItemPrice: item.price,
                bookId: item.book.id,
                title: item.book.title,
                author: item.book.author,
                price: item.book.price,
            })),
        });

        return isSingleOrder
            ? formatOrder(response)
            : response.map(formatOrder);
    }
}
