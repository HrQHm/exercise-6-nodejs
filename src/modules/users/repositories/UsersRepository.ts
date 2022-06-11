import { getRepository, Repository } from "typeorm";

import { User } from "../entities/User";
import { ICreateUserDTO } from "../useCases/createUser/ICreateUserDTO";
import { IUsersRepository } from "./IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      email,
    });
  }

  async findById(user_id: string): Promise<User | undefined> {
    return this.repository.findOne(user_id);
  }

  async create({ name, email, password, phone }: ICreateUserDTO): Promise<User> {

    const user = this.repository.create({ name, email, password, phone });
    await this.repository.save(user);
    return user;
  }


  async updateUserPhone(user_id: string, phone: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ phone })
      .where("id = :user_id")
      .setParameters({ user_id })
      .execute()
  }
}
