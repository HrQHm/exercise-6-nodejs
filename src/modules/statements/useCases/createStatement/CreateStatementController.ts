import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    let { id: user_id } = request.user;
    const { receiver_id } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    
    const isTransferStatement = receiver_id !== undefined;

    let type = splittedPath[splittedPath.length - 1] as OperationType;
    
    if(isTransferStatement){
      type = splittedPath[splittedPath.length - 2] as OperationType;
    }

    const sender_id = user_id;
    if(type === 'transfer') {
      user_id = receiver_id;
    }

    const createStatement = container.resolve(CreateStatementUseCase);
    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    return response.status(201).json(statement);
  }
}
