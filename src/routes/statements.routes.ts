
import { Router } from 'express';

import { CreateStatementController } from '../modules/statements/useCases/createStatement/CreateStatementController';
import { GetBalanceController } from '../modules/statements/useCases/getBalance/GetBalanceController';
import { GetBalanceByDateController } from '../modules/statements/useCases/getBalanceByDate/GetBalanceByDateController';
import { GetStatementOperationController } from '../modules/statements/useCases/getStatementOperation/GetStatementOperationController';
import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const getBalanceByDateController = new GetBalanceByDateController();
const createStatementController = new CreateStatementController();
const getStatementOperationController = new GetStatementOperationController();

statementRouter.use(ensureAuthenticated);

statementRouter.get('/balance', getBalanceController.execute);
statementRouter.get('/balance/date/', getBalanceByDateController.handle);
statementRouter.post('/deposit', createStatementController.execute);
statementRouter.post('/withdraw', createStatementController.execute);
statementRouter.post('/transfer/:receiver_id', createStatementController.execute);
statementRouter.get('/:statement_id', getStatementOperationController.execute);

export { statementRouter };
