import { ApiProperty } from "@nestjs/swagger";
import { number } from "joi";

export class CreateOrderDto {
    @ApiProperty({ type: number, description: "ID of the cart", example: 1 })
    cartId: number;
}
