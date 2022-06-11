import { Statement } from "@modules/statements/entities/Statement";
import { StatementsRepository } from "../../repositories/StatementsRepository";
import { UsersRepository } from "../../../users/repositories/UsersRepository";
import { inject, injectable } from "tsyringe";
import { GetBalanceError } from "../getBalance/GetBalanceError";

interface IRequest {
  user_id: string;
  start_date: Date;
  end_date: Date;
}

interface IResponse {
  statement: Statement[];
  balance: number;
}

@injectable()
export class GetBalanceByDateUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: StatementsRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository
  ) { }

  async execute({ user_id, start_date, end_date }: IRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new GetBalanceError();
    }

    const balance = await this.statementsRepository.getUserBalanceByDate({ user_id, start_date, end_date });
    return balance as IResponse;
  }
};