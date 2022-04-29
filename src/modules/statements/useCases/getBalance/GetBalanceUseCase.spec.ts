import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "@modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let getBalanceUseCase: GetBalanceUseCase;
let createStatementeUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Show Balance", () =>  {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementeUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should be able to get the balance", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com.br",
      password: "12345",
    });

    await createStatementeUseCase.execute({
      user_id: user.id,
      type: 'DEPOSIT' as OperationType,
      amount: 100,
      description: "Test Statement Operation Deposit"
    });

    await createStatementeUseCase.execute({
      user_id: user.id,
      type: 'WITHDRAW' as OperationType,
      amount: 50,
      description: "Test Statement Operation Withdraw"
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });
    expect(balance).toHaveProperty("balance");
  });

  it("Should not be able to show balance if user doesn't exist ", async () => {
    expect(async() => {
      await getBalanceUseCase.execute({ user_id: '12345' });
  
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});