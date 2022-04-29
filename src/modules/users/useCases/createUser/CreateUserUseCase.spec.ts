import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create a user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com.br",
      password: "12345",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create an user with same email", async () => {
    expect(async() => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com.br",
        password: "12345",
      });

      await createUserUseCase.execute({
        name: "User Test2",
        email: "user@test.com.br",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});