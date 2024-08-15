import { Controller, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { throwException } from "../../shared/utility/throw-exception";
import { CreateUserDto } from "./dto/register-user.dto";
import { AuthService } from "./authentication.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ApiOperation({ summary: "Register a new user" })
    @ApiResponse({ status: 201, description: "User successfully registered" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiResponse({ status: 409, description: "Conflict" })
    @ApiResponse({ status: 422, description: "Unprocessable Entity" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.authService.registerUser(createUserDto);
        } catch (error) {
            throwException(error);
        }
    }

    @Post("login")
    @ApiOperation({ summary: "Log in a user" })
    @ApiResponse({ status: 200, description: "Login successful" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 422, description: "Unprocessable Entity" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async login(@Body() loginDto: LoginDto) {
        try {
            return await this.authService.login(loginDto);
        } catch (error) {
            throwException(error);
        }
    }
}
