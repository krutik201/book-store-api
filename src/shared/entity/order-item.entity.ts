import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    BaseEntity,
} from "typeorm";
import { Order } from "./order.entity";
import { Book } from "./book.entity";

@Entity("order_items")
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    quantity: number;

    @Column("decimal", { precision: 10, scale: 2, name: "per_item_price" })
    perItemPrice: number;

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

    @ManyToOne(() => Order, { nullable: true })
    @JoinColumn({ name: "order_id", referencedColumnName: "id" })
    order: Order;

    @ManyToOne(() => Book, { nullable: true })
    @JoinColumn({ name: "book_id", referencedColumnName: "id" })
    book: Book;
}
