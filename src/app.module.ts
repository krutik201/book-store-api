import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "config/configuration";
import { validationSchema } from "config/validation";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/authentication/authentication.module";
import { typeOrmConfig } from "./config/typeorm.config";
import { User } from "./shared/entity/user.entity";
import { BookModule } from "./modules/book/book.module";
import { Book } from "./shared/entity/book.entity";
import { CartModule } from "./modules/cart/cart.module";
import { OrderModule } from "./modules/order/order.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.cwd()}/config/env/development.env`,
            load: [configuration],
            validationSchema,
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(typeOrmConfig),
        TypeOrmModule.forFeature([User, Book]),

        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        AuthModule,
        BookModule,
        CartModule,
        OrderModule,
    ],
})
export class AppModule {}
