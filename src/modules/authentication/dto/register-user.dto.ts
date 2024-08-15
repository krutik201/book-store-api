import { IsString, IsEmail, IsOptional, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: "Email address of the user",
        example: "user@example.com",
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Password for the user account",
        example: "StrongPassword123!",
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "First name of the user",
        example: "John",
    })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Last name of the user",
        example: "Doe",
    })
    lastName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: "Phone number of the user",
        example: "+1234567890",
        required: false,
    })
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: "Address of the user",
        example: "123 Main St, Springfield, IL",
        required: false,
    })
    address?: string;
}
