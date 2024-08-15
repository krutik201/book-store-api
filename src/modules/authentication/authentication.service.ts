import { Injectable, UnauthorizedException } from "@nestjs/common";
import { throwException } from "../../shared/utility/throw-exception";
import { AuthRepository } from "./authentication.repository";
import { CreateUserDto } from "./dto/register-user.dto";
import { AppResponse } from "../../shared/interface/app-response.interface";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService
    ) {}

    /**
     * [@Description: Register a new user
     * @param {CreateUserDto} createUserDto - Data Transfer Object containing user registration details.
     * @returns {Promise<{ message: string, data: User }>} - Response object
     * @author: Krutik Shukla
     **/
    async registerUser(createUserDto: CreateUserDto): Promise<AppResponse> {
        try {
            /* Register the new user using the UserService */
            const dbUser =
                await this.authRepository.registerUser(createUserDto);

            /* Return a success message with the registered user */
            return {
                message: "SUC_USER_REGISTER",
                data: dbUser,
            };
        } catch (error) {
            /* Handle any errors during registration */
            throwException(error);
        }
    }

    /**
     * Log in a user and return a JWT token
     * @param {LoginDto} loginDto - Data Transfer Object containing login details.
     * @returns {Promise<{ message: string, data: { accessToken: string } }>} - The JWT access token with a success message.
     * @author: Krutik Shukla
     */
    async login(loginDto): Promise<AppResponse> {
        try {
            const user = await this.authRepository.findUserByEmail(
                loginDto.email
            );

            if (!(await bcrypt.compare(loginDto.password, user.password))) {
                throw new UnauthorizedException("ERR_INVALID_CREDENTIAL");
            }

            /* Generating Token for the JWT */
            const accessToken = this.generateJwtToken(user);

            return {
                message: "USER_LOGGED_IN",
                data: { accessToken },
            };
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * Generate JWT token with a 1-day expiration
     * @param {User} user - The user object containing id, email, and isActive status.
     * @returns {string} - The generated JWT token.
     * @author: krutik Shukla
     */
    generateJwtToken(user): string {
        try {
            /* Creating Payload */
            const payload = {
                email: user.email,
                id: user.id,
                isActive: user.isActive,
            };

            /* Set the token to expire in 1 day */
            const secretKey = process.env.JWT_SECRET_KEY;

            const accessToken = this.jwtService.sign(payload, {
                secret: secretKey,
                expiresIn: process.env.JWT_EXPIRE_SECRET_KEY,
            });

            return accessToken;
        } catch (error) {
            throwException(error);
        }
    }
}
