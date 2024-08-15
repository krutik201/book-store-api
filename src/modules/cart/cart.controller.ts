import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { AppResponse } from "../../shared/interface/app-response.interface";
import { throwException } from "../../shared/utility/throw-exception";
import { CartService } from "./cart.service";
import { GetUser } from "../../shared/decorators/login.decorator";
import { AddToCartDto } from "./dto/add-cart.dto";

@ApiTags("Cart")
@Controller("cart")
@ApiBearerAuth()
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get("/list")
    @ApiOperation({ summary: "Get cart details for the authenticated user" })
    @ApiResponse({
        status: 200,
        description: "Cart details retrieved successfully",
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async getCart(@GetUser() user): Promise<any> {
        try {
            const userId = user.id;
            return await this.cartService.getCartByUserId(userId);
        } catch (error) {
            throwException(error);
        }
    }

    @Post("/add")
    @ApiOperation({ summary: "Add a book to the cart" })
    @ApiResponse({
        status: 201,
        description: "Book added to cart successfully",
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async addToCart(
        @GetUser() user,
        @Body() addToCartDto: AddToCartDto
    ): Promise<AppResponse> {
        try {
            const userId = user.id;
            return await this.cartService.addToCart(userId, addToCartDto);
        } catch (error) {
            throwException(error);
        }
    }

    @Delete("/remove/:bookId")
    @ApiOperation({ summary: "Remove a book from the cart" })
    @ApiResponse({
        status: 200,
        description: "Item removed from cart successfully",
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async removeFromCart(
        @GetUser() user,
        @Param("bookId") bookId: number
    ): Promise<AppResponse> {
        try {
            const userId = user.id;
            return await this.cartService.removeFromCart(userId, bookId);
        } catch (error) {
            throwException(error);
        }
    }
}
