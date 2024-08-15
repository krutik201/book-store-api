import { DocumentBuilder } from "@nestjs/swagger";

export const SwaggerConfig = new DocumentBuilder()
    .setTitle("Simplified Bookstore API")
    .addBearerAuth()
    .addCookieAuth("auth")
    .setDescription("The Weather Forecast API documentation")
    .setVersion("1.0")
    .build();
