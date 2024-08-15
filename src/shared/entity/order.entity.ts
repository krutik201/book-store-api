import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    BaseEntity,
} from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity";

@Entity("orders")
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("decimal", { precision: 10, scale: 2, name: "total_amount" })
    totalAmount: number;

    @Column({ type: "varchar", length: 50, default: "pending" })
    status: string;

    @CreateDateColumn({ type: "timestamp with time zone", name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp with time zone", name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
        cascade: true,
    })
    items: OrderItem[];

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: User;
}
