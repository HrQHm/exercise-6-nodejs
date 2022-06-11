import { IUsersRepository } from "../../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { ShowUserProfileError } from "../showUserProfile/ShowUserProfileError";

interface IRequest {
  user_id: string;
  phone: string;
}

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) { }
  async execute({ user_id, phone }: IRequest): Promise<void> {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ShowUserProfileError();
    }


    await this.usersRepository.updateUserPhone(user_id, phone);
  }
}