import { Request, Response } from 'express';
import { BalanceMap } from '../../mappers/BalanceMap';
import { container } from 'tsyringe';
import { GetBalanceByDateUseCase } from './GetBalanceByDateUseCase';

export class GetBalanceByDateController {
  async handle(req: Request, res: Response) {
    const { id: user_id } = req.user;
    const { start_date, end_date } = req.body;

    const getBalanceByDate = container.resolve(GetBalanceByDateUseCase);

    const balance = await getBalanceByDate.execute({ user_id, start_date, end_date });

    const balanceDTO = BalanceMap.toDTO(balance);

    return res.json(balanceDTO);
  }
}