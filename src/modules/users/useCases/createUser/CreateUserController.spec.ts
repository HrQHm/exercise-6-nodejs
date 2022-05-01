import request from 'supertest';
import { Connection } from "typeorm";
import { hash } from 'bcryptjs';
import { app } from '../../../../app';
import createConnection from '../../../../database/index';
let connection: Connection;

describe("Create user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new user", async () => {
    const response = await request(app).post('/api/v1/users').send({
      email: "user@example.com",
      name: "user",
      password: "123",
    });
    
    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user wit email exist", async () => {
    const response = await request(app).post('/api/v1/users').send({
      email: "user@example.com",
      name: "user2",
      password: "1234",
    });
    
    expect(response.status).toBe(400);
  });
});


