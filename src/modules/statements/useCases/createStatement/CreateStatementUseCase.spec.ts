import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { AppError } from "@sharederrors/AppError";

let createStatementeUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create a statement", () =>  {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementeUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should be able to make a statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com.br",
      password: "12345",
    });

    const statementOperationDeposit = await createStatementeUseCase.execute({
      user_id: user.id,
      type: 'DEPOSIT' as OperationType,
      amount: 100,
      description: "Test Statement Operation Deposit"
    });

    const statementOperationWithdraw = await createStatementeUseCase.execute({
      user_id: user.id,
      type: 'WITHDRAW' as OperationType,
      amount: 50,
      description: "Test Statement Operation Withdraw"
    });

    expect(statementOperationDeposit).toHaveProperty("id");
    expect(statementOperationWithdraw).toHaveProperty("id");
  });

  it("Should not be able to make withdraw if user does not have enough funds ", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com.br",
        password: "12345",
      });
 
      const test = await createStatementeUseCase.execute({
        user_id: user.id,
        type: 'WITHDRAW' as OperationType,
        amount: 200,
        description: "Test Statement Operation WITHDRAW"
      });

      console.log(test);
  
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create statement if user doesn't exist ", async () => {
    expect(async() => {
      await createStatementeUseCase.execute({
        user_id: "1234",
        type: 'DEPOSIT' as OperationType,
        amount: 100,
        description: "Test Statement Operation Deposit"
      });
  
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});