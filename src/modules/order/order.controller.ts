import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AppResponse } from "../../shared/interface/app-response.interface";
import { throwException } from "../../shared/utility/throw-exception";
import { OrderService } from "./order.service";
import { GetUser } from "../../shared/decorators/login.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";

@ApiTags("Orders")
@Controller("order")
@ApiBearerAuth()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post("/add")
    @ApiOperation({ summary: "Place an order" })
    @ApiResponse({
        status: 201,
        description: "Order placed successfully",
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async placeOrder(
        @GetUser() user,
        @Body() createOrderDto: CreateOrderDto
    ): Promise<AppResponse> {
        try {
            const userId = user.id;
            return await this.orderService.createOrder(createOrderDto, userId);
        } catch (error) {
            throwException(error);
        }
    }

    @Get("/")
    @ApiOperation({ summary: "View order history for the authenticated user" })
    @ApiResponse({
        status: 200,
        description: "Order history retrieved successfully",
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async getOrderHistory(@GetUser() user): Promise<AppResponse> {
        try {
            const userId = user.id;
            return await this.orderService.getOrderHistory(userId);
        } catch (error) {
            throwException(error);
        }
    }

    @Get("/:orderId")
    @ApiOperation({ summary: "Get order details" })
    @ApiResponse({
        status: 200,
        description: "Order details retrieved successfully",
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Order not found" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async getOrderDetails(
        @GetUser() user,
        @Param("orderId") orderId: number
    ): Promise<AppResponse> {
        try {
            const userId = user.id;
            return await this.orderService.getOrderDetails(userId, orderId);
        } catch (error) {
            throwException(error);
        }
    }
}
