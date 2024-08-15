import {
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { CartItem } from "./cart-item.entity";

@Entity("cart")
export class Cart extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    isOrdered: boolean;

    @Column({ default: false, name: "is_deleted" })
    isDeleted: boolean;

    @Column("uuid", { name: "created_by", nullable: true })
    createdBy: string | null;

    @Column("uuid", { name: "updated_by", nullable: true })
    updatedBy: string | null;

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

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItem;
}
