import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ 
    user_id, 
    type, 
    amount, 
    description,
    sender_id}: ICreateStatementDTO) {
    
    const user = await this.usersRepository.findById(user_id);
    
    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const sender_user = await this.usersRepository.findById(sender_id);
    if(!sender_user && type === 'transfer') {
      throw new CreateStatementError.SenderUserNotFound();
    }

    if(type === 'withdraw' || type === 'transfer') {
      const userId = type === 'transfer' ? sender_id : user_id;
      const { balance } = await this.statementsRepository.getUserBalance({ user_id:userId });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }
    
    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    return statementOperation;
  }
}
