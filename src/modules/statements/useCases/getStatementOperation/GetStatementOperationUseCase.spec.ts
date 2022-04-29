import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "@modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { GetStatementOperationError } from "./GetStatementOperationError";


let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementeUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Show Statement Operation", () =>  {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementeUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should be able to get the statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com.br",
      password: "12345",
    });

    const operation = await createStatementeUseCase.execute({
      user_id: user.id,
      type: 'DEPOSIT' as OperationType,
      amount: 100,
      description: "Test Statement Operation Deposit"
    });

    const statement = await getStatementOperationUseCase.execute({ user_id: user.id, statement_id:operation.id  });
    
    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to show statement operation if user doesn't exist ", async () => {
    expect(async() => {
      await getStatementOperationUseCase.execute({ user_id: '12345', statement_id: '123' });
  
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to show statement if statement doesn't exist ", async () => {
    expect(async() => {
      const user = await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com.br",
        password: "12345",
      });

      await getStatementOperationUseCase.execute({ user_id: user.id, statement_id: '123' });
  
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});