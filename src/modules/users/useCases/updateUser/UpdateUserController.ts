import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateUserUseCase } from './UpdateUserUseCase';

export class UpdateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const { phone } = req.body;
    const updateUserUseCase = container.resolve(UpdateUserUseCase);
    await updateUserUseCase.execute({ user_id: id, phone });

    return res.status(201).send();
  }
}
