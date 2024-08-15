import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CreateUserDto } from "./dto/register-user.dto";
import { User } from "../../shared/entity/user.entity";
import { throwException } from "../../shared/utility/throw-exception";

@Injectable()
export class AuthRepository extends Repository<User> {
    constructor(readonly dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    /**
     * [@Description: Register a new user]
     * @param createUserDto - Data Transfer Object containing user details for registration
     * @author: Krutik Shukla
     **/
    async registerUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            /* Destructure the CreateUserDto to extract the user details */
            const {
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
            } = createUserDto;

            /* Create a new User entity with the provided details */
            const user = this.create({
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
            });

            /* Save the newly created user to the database */
            return await this.save(user);
        } catch (error) {
            /* Handle any errors that occur during user registration */
            throwException(error);
        }
    }

    /**
     * Find a user by their email
     * @param {string} email - The email of the user to find.
     * @returns {Promise<User>} - The user found with the given email, or undefined if no user is found.
     */
    async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.findOne({
                where: { email: email, isActive: true, isDeleted: false },
            });
            if (!user) {
                throw new NotFoundException("ERR_USER_NOT_REGISTERED");
            }

            return user;
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * Find a user by their id
     * @param {number} userId - The id of the user to find.
     * @returns {Promise<User>} - The user found with the given id, or undefined if no user is found.
     */
    async findUserById(userId): Promise<User> {
        try {
            const user = await this.findOne({
                where: { id: userId, isActive: true, isDeleted: false },
            });
            if (!user) {
                throw new NotFoundException("ERR_USER_NOT_FOUND");
            }

            return user;
        } catch (error) {
            throwException(error);
        }
    }
}
