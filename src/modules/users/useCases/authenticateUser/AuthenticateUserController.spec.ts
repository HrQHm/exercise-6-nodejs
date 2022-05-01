import request from 'supertest';
import { Connection } from "typeorm";
import { app } from '../../../../app';
import createConnection from '../../../../database/index';
let connection: Connection;

describe("Authenticate a user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Shoul be Able to authenticate a user", async () => {
    await request(app).post('/api/v1/users').send({
      email: "user@example.com",
      name: "user",
      password: "123",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@example.com",
      password: "123",
    });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Shoul not be Able to authenticate a user if email is incorrect", async () => {
    
    await request(app).post('/api/v1/users').send({
      email: "user2@example.com",
      name: "user2",
      password: "123",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "user33@example.com",
      password: "123",
    });
    
    expect(response.status).toBe(401);
  });

  it("Shoul not be Able to authenticate a user if password is incorrect", async () => {
    
    await request(app).post('/api/v1/users').send({
      email: "user3@example.com",
      name: "user3",
      password: "123",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "user3@example.com",
      password: "123567",
    });
    
    expect(response.status).toBe(401);
  });

});