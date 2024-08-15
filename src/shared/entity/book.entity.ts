import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from "typeorm";

@Entity("book")
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "varchar", length: 255 })
    author: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @Column({ type: "int" })
    stock: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    genre: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    language: string;

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
}
