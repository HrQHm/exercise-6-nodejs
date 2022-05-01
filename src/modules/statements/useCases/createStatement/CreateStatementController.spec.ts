import request from 'supertest';
import { Connection } from "typeorm";
import { app } from '../../../../app';
import createConnection from '../../../../database/index';
let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Shoul be Able to create a deposit statement", async () => {
    await request(app).post('/api/v1/users').send({
      email: "user@example.com",
      name: "user",
      password: "123",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "user@example.com",
      password: "123",
    });

    const { token } = auth.body;

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: "Salary"
    }).
    set({
      Authorization: `Bearer ${token}`
    });
    
    expect(response.status).toBe(201);
    expect(response.body.type).toEqual("deposit");
  });

  it("Shoul be Able to create a withdraw statement", async () => {
    const auth = await request(app).post("/api/v1/sessions").send({
      email: "user@example.com",
      password: "123",
    });

    const { token } = auth.body;

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 50,
      description: "Supermarket"
    }).
    set({
      Authorization: `Bearer ${token}`
    });
    
    expect(response.status).toBe(201);
    expect(response.body.type).toEqual("withdraw");
  });

  it("Shoul not be Able to create a withdraw statement if user does not have sufficient funds", async () => {
    const auth = await request(app).post("/api/v1/sessions").send({
      email: "user@example.com",
      password: "123",
    });

    const { token } = auth.body;

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 150,
      description: "New game"
    }).
    set({
      Authorization: `Bearer ${token}`
    });
    
    expect(response.status).toBe(400);
  });
});