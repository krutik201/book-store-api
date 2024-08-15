import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Book } from "../../shared/entity/book.entity";
import { throwException } from "../../shared/utility/throw-exception";

@Injectable()
export class BookRepository extends Repository<Book> {
    constructor(readonly dataSource: DataSource) {
        super(Book, dataSource.createEntityManager());
    }

    /**
     * [@Description: Retrieves a paginated list of books from the database based on the provided filters.]
     * @param {any} filterDto - Data Transfer Object containing pagination, sorting, and search filters.
     * @author: Krutik Shukla
     **/
    async getBookList(filterDto): Promise<any> {
        try {
            const { offset, limit, orderBy, orderDir, search } = filterDto;

            const query = this.createQueryBuilder("book");

            /* Selecting only specific fields */
            query.select([
                "book.id",
                "book.title",
                "book.author",
                "book.price",
                "book.stock",
                "book.createdAt",
            ]);

            /* Apply search functionality if provided */
            if (search) {
                const searchTerm = `%${search}%`;
                query.andWhere(
                    "(LOWER(book.title) LIKE LOWER(:searchTerm) OR LOWER(book.author) LIKE LOWER(:searchTerm) OR LOWER(book.description) LIKE LOWER(:searchTerm))",
                    { searchTerm }
                );
            }

            /* Apply sorting */
            if (orderBy) {
                query.orderBy(`book.${orderBy}`, orderDir);
            } else {
                query.orderBy("book.createdAt", "DESC"); // default order
            }

            /* Apply pagination */
            query.skip(offset * limit);
            query.take(limit);

            /* Fetch books */
            const dbBooks = await query.getManyAndCount();

            if (filterDto) {
                filterDto.count = dbBooks[1];
            }

            return {
                bookData: dbBooks[0],
                page: filterDto,
            };
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function retrieves a specific book from the database by its ID]
     * @param {number} id - The ID of the book to be retrieved.
     * @author: Krutik Shukla
     **/
    async getBookById(id: number): Promise<Book> {
        try {
            const book = await this.findOne({
                where: { id: id, isActive: true, isDeleted: false },
            });

            if (!book) {
                throw new NotFoundException("ERR_BOOK_NOT_FOUND");
            }

            return book;
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * [@Description: This function update the book stock every time when order placed]
     * @param bookId quantity - The ID of the book to be retrieved.
     * @author: Krutik Shukla
     **/
    async updateBookStock(bookId, quantity) {
        try {
            const book = await this.findOne({ where: { id: bookId } });
            book.stock -= quantity;
            return await this.save(book);
        } catch (error) {
            throwException(error);
        }
    }
}
