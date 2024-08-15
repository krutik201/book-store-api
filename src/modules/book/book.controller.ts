import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppResponse } from "../../shared/interface/app-response.interface";
import { BookService } from "./book.service";
import { throwException } from "../../shared/utility/throw-exception";
import { PageQueryDto } from "../../shared/dto/page-query.dto";

@ApiTags("Book")
@Controller("book")
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get("/list")
    @ApiOperation({ summary: "Get all book list" })
    @ApiResponse({ status: 200, description: "The found records" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 422, description: "Unprocessable Entity" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async getBookList(
        @Query() pageQueryDto: PageQueryDto
    ): Promise<AppResponse> {
        try {
            return await this.bookService.getBookList(pageQueryDto);
        } catch (error) {
            throwException(error);
        }
    }

    @Get("/:bookId")
    @ApiOperation({ summary: "Get a book by ID" })
    @ApiResponse({ status: 200, description: "The found record" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 422, description: "Unprocessable Entity" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async getBookById(@Param("bookId") bookId: number): Promise<AppResponse> {
        try {
            /* Fetch the book by ID from the service */
            return await this.bookService.getBookById(bookId);
        } catch (error) {
            throwException(error);
        }
    }
}
