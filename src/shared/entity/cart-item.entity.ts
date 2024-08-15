import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    BaseEntity,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Book } from "./book.entity";

@Entity()
export class CartItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    quantity: number;

    @CreateDateColumn({
        type: "timestamp with time zone",
        name: "created_at",
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp with time zone",
        name: "updated_at",
    })
    updatedAt: Date;

    @ManyToOne(() => Cart, (cart) => cart.id)
    @JoinColumn({ name: "cart_id", referencedColumnName: "id" })
    cart: Cart;

    @ManyToOne(() => Book, (book) => book.id)
    @JoinColumn({ name: "book_id", referencedColumnName: "id" })
    book: Book;
}
