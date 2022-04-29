import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate a User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
  });

  it("Should be able to authenticate a user", async () => {
    await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com.br",
      password: "12345",
    });

    const token = await authenticateUserUseCase.execute({email: "user@test.com.br", password: "12345"});
    
    expect(token).toHaveProperty("token");
  });

  it("Should not be able authenticate if email is incorrect ", async () => {
    expect(async() => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com.br",
        password: "12345",
      });

      const authentication = await authenticateUserUseCase.execute({email: "user@testt.com.br", password: "12345"});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able authenticate if password is incorrect ", async () => {
    expect(async() => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com.br",
        password: "12345",
      });

      const authentication = await authenticateUserUseCase.execute({email: "user@test.com.br", password: "123"});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});