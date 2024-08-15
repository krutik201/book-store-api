import { Injectable } from "@nestjs/common";
import { throwException } from "../../shared/utility/throw-exception";
import { BookRepository } from "./book.repository";
@Injectable()
export class BookService {
    constructor(private readonly bookRepository: BookRepository) {}

    /**
     * [@Description: Get all book with filters from the repository
     * @param {CreateUserDto} pageQueryDto - Data Transfer Object containing user registration details.
     * @returns List of all bookings
     * @author: Krutik Shukla
     **/
    async getBookList(pageQueryDto): Promise<any> {
        try {
            const dbBookList =
                await this.bookRepository.getBookList(pageQueryDto);

            return {
                message: "SUC_BOOK_LIST",
                data: dbBookList,
            };
        } catch (error) {
            throw throwException(error);
        }
    }

    /**
     * [@Description: Get all book with filters from the repository
     * @param {CreateUserDto} pageQueryDto - Data Transfer Object containing user registration details.
     * @returns List of all bookings
     * @author: Krutik Shukla
     **/
    async getBookById(id: number): Promise<any> {
        try {
            const dbBookList = await this.bookRepository.getBookById(id);

            return {
                message: "SUC_BOOK_GET",
                data: dbBookList,
            };
        } catch (error) {
            throw throwException(error);
        }
    }
}
