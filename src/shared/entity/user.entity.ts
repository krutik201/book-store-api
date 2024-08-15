import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    BeforeInsert,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Cart } from "./cart.entity";

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "varchar", length: 255 })
    password: string;

    @Column({ type: "varchar", length: 100 })
    firstName: string;

    @Column({ type: "varchar", length: 100 })
    lastName: string;

    @Column({ type: "varchar", length: 15, nullable: true })
    phoneNumber: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    address: string;

    @Column({ type: "boolean", default: false })
    isAdmin: boolean;

    @Column({ default: false, name: "is_deleted" })
    isDeleted: boolean;

    @Column({ default: true, name: "is_active" })
    isActive: boolean;

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

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @OneToMany(() => Cart, (cart) => cart.user)
    cart: Cart[];
}
