import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class AddToCartDto {
    @ApiProperty({
        description: "Id of the book to add to the cart",
        example: "19",
    })
    @IsNotEmpty({ message: "Please provide a valid book ID." })
    bookId: number;

    @ApiProperty({
        description: "Quantity of the book to add to the cart",
        example: 1,
    })
    @IsNumber()
    @Min(1, { message: "Quantity must be at least 1." })
    @IsNotEmpty({ message: "Please provide the quantity." })
    quantity: number;
}
