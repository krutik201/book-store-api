import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const token =
            request.headers.authorization.split(
                " "
            )[1]; /* Extract token from 'Bearer <token>' */
        try {
            const decodedToken: any = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            ); /* Verify and decode the token */
            return decodedToken; /* Assuming the token contains the user information */
        } catch (error) {}
        throw new UnauthorizedException("ERR_INVALID_TOKEN");
    }
);
