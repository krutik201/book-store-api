import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @IsEmail()
    @ApiProperty({
        description: "Email address of the user",
        example: "user@example.com",
    })
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({
        description: "Password of the user",
        example: "securePassword123",
    })
    password: string;
}
