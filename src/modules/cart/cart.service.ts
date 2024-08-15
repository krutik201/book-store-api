import { Injectable } from "@nestjs/common";
import { CartRepository } from "./cart.repository";
import { throwException } from "../../shared/utility/throw-exception";
import { AuthRepository } from "../authentication/authentication.repository";
import { AppResponse } from "../../shared/interface/app-response.interface";

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly userRepository: AuthRepository
    ) {}

    /**
     * [@Description: This function for find cart items]
     * @param { userId }- to add cart details
     * @author: Krutik Shukla
     **/
    async getCartByUserId(userId): Promise<any> {
        try {
            /* Authenticate the user */
            await this.userRepository.findUserById(userId);

            const dbBookList =
                await this.cartRepository.getCartByUserId(userId);

            const formatResponse = this.formatCartResponse(dbBookList);

            return {
                message: "SUC_CART_LIST",
                data: formatResponse,
            };
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function for add cart items]
     * @param { userId ,addToCartDto}- to add cart details
     * @author: Krutik Shukla
     **/
    async addToCart(userId, addToCartDto): Promise<AppResponse> {
        try {
            /* Extract the addToCartDto */
            const { bookId, quantity } = addToCartDto;

            /* Authenticate the user */
            await this.userRepository.findUserById(userId);

            const cart = await this.cartRepository.findOrCreateCart(userId);

            let cartItem = await this.cartRepository.findCartItem(
                cart.id,
                bookId
            );

            if (cartItem) {
                /* Update quantity if the book is already in the cart */
                cartItem.quantity += quantity;
            } else {
                /* Add new cart item if not present in the cart */
                cartItem = await this.cartRepository.addCartItems(
                    cart,
                    bookId,
                    quantity
                );
            }

            await this.cartRepository.saveCartItem(cartItem);

            return {
                message: "SUC_CART_ADDED",
                data: cart,
            };
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function for remove cart details]
     * @param { userId ,bookId}- to add cart details
     * @author: Krutik Shukla
     **/
    async removeFromCart(userId, bookId): Promise<AppResponse> {
        try {
            const cart = await this.cartRepository.getCartByUserId(userId);

            const cartItem = await this.cartRepository.findCartItem(
                cart?.id,
                bookId
            );

            /*Removing Cart Items*/
            await this.cartRepository.removeCartItem(cartItem);

            return {
                message: "SUC_ITEM_REMOVED",
                data: {},
            };
        } catch (error) {
            throwException(error);
        }
    }

    formatCartResponse(cart) {
        return {
            id: cart.id,
            isOrdered: cart.isOrdered,
            isDeleted: cart.isDeleted,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
            items: cart.items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                book: {
                    id: item.book.id,
                    title: item.book.title,
                    author: item.book.author,
                    price: item.book.price,
                },
            })),
        };
    }
}
