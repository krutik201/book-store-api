import { DataSource, Repository } from "typeorm";
import { Cart } from "../../shared/entity/cart.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { throwException } from "../../shared/utility/throw-exception";
import { CartItem } from "../../shared/entity/cart-item.entity";

@Injectable()
export class CartRepository extends Repository<Cart> {
    constructor(readonly dataSource: DataSource) {
        super(Cart, dataSource.createEntityManager());
    }

    /**
     * [@Description: Get cart by user ID]
     * @param userId - ID of the user
     * @author: Krutik Shukla
     */
    async getCartByUserId(userId): Promise<Cart> {
        try {
            /* Find the cart using the user entity */
            const dbCart = await this.findOne({
                where: { user: { id: userId }, isOrdered: false },
                relations: ["items", "items.book"],
            });

            /* Throwing not found Error*/
            if (!dbCart) {
                throw new NotFoundException("ERR_CART_NOT_FOUND");
            }

            return dbCart;
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function used for find or create cart]
     * @param userId - UserId to check cart details
     * @author: Krutik Shukla
     **/
    async findOrCreateCart(userId): Promise<any> {
        try {
            let cart = await this.findOne({
                where: { user: userId, isOrdered: false },
                relations: ["items", "items.book"],
            });

            if (!cart) {
                cart = this.create({ user: { id: userId }, isOrdered: false });
                await this.save(cart);
            }

            return cart;
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function find cart items]
     * @param {cartId ,bookId }- to get Cart item details
     * @author: Krutik Shukla
     **/
    async findCartItem(cartId, bookId): Promise<CartItem> {
        try {
            const dbCartItem = await CartItem.findOne({
                where: { cart: { id: cartId }, book: { id: bookId } },
            });

            return dbCartItem;
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function for adding cart items]
     * @param {cart, bookId, quantity }- to add cart details
     * @author: Krutik Shukla
     **/
    async addCartItems(cart, bookId, quantity) {
        try {
            return CartItem.create({
                cart,
                book: { id: bookId },
                quantity,
            });
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function for saving cart items]
     * @param {cartItem }- to add cart details
     * @author: Krutik Shukla
     **/
    async saveCartItem(cartItem: CartItem): Promise<CartItem> {
        try {
            return await CartItem.save(cartItem);
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function for remove cart items]
     * @param {cartItem }- to add cart details
     * @author: Krutik Shukla
     **/
    async removeCartItem(cartItem) {
        try {
            return await CartItem.remove(cartItem);
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function for find cart items]
     * @param {cartId, userId }- to add cart details
     * @author: Krutik Shukla
     **/
    async findCartById(cartId, userId): Promise<any> {
        try {
            const cart = await this.findOne({
                where: { id: cartId, user: userId, isOrdered: false },
                relations: ["items", "items.book"],
            });

            if (!cart) {
                throw new Error("ERR_CART_NOT_FOUND");
            }

            return cart;
        } catch (error) {
            throwException(error);
        }
    }
}
