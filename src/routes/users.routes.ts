import { Router } from 'express';
import { UpdateUserController } from '../modules/users/useCases/updateUser/UpdateUserController';
import { CreateUserController } from '../modules/users/useCases/createUser/CreateUserController';
import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';

const usersRouter = Router();
const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();


usersRouter.post('/', createUserController.execute);
usersRouter.put('/updateUser', ensureAuthenticated, updateUserController.handle);
export { usersRouter };
