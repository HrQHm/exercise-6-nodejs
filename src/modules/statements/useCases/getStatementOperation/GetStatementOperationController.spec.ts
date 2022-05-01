import request from 'supertest';
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid"
import { app } from '../../../../app';
import createConnection from '../../../../database/index';
let connection: Connection;

describe("Show Statement Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be Able to show statement operation", async () => {
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

    const statement = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: "Salary"
    }).
    set({
      Authorization: `Bearer ${token}`
    });

    const { id } = statement.body;

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    });
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id");
  });

  it("Should not be Able to show statement operation if statement operation not exist", async () => {
    const auth = await request(app).post("/api/v1/sessions").send({
      email: "user@example.com",
      password: "123",
    });

    const { token } = auth.body;

    const statement = await request(app).post('/api/v1/statements/deposit').send({
      amount: 20,
      description: "Allowance"
    }).
    set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).get(`/api/v1/statements/${uuidV4()}`).set({
      Authorization: `Bearer ${token}`
    });
    
    expect(response.status).toBe(404);
  });
});