import request from 'supertest';
import { Connection } from "typeorm";
import { app } from '../../../../app';
import createConnection from '../../../../database/index';
let connection: Connection;

describe("Show Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Shoul be Able to show user balance", async () => {
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

    await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: "Salary"
    }).
    set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    });
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("balance");
  });
});
