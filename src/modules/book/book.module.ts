import { Module } from "@nestjs/common";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { BookRepository } from "./book.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "../../shared/entity/book.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Book])],
    providers: [BookService, BookRepository],
    controllers: [BookController],
})
export class BookModule {}
