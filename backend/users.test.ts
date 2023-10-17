import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import request from "supertest";

import app from ".";
import data from './data';
import db from './db';
import { Addresses, Users } from './schemas';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

const getToken = async () => {
  await request(app).post("/users").send(data.user);
  return jwt.sign({ username: data.user.username }, TOKEN_SECRET);
}

describe('Users and their addresses', () => {
  afterEach(async () => {
    await db();
    await Users.deleteMany({});
    await Addresses.deleteMany({});
  });

  // DONE
  test('POST /users', async () => {
    let response = await request(app).post("/users");
    expect(response.statusCode).toBe(500);
    response = await request(app).post("/users").send(data.user);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(data.user);
  });

  // DONE
  test('PUT /users', async () => {
    const token = await getToken();
    const response = await request(app).put("/users").set('authorization', `Bearer ${token}`).send({
      ...data.user,
      firstName: "Peter"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      ...data.user,
      firstName: "Peter"
    });
  });

  // DONE
  test('DELETE /users', async () => {
    const token = await getToken();

    // check for current object
    let response = await request(app).get("/users").set('authorization', `Bearer ${token}`);
    expect(response.body).toMatchObject(data.user);

    await request(app).delete("/users").set('authorization', `Bearer ${token}`);

    // check for deletion
    response = await request(app).get("/users").set('authorization', `Bearer ${token}`);
    expect(response.body).toEqual({});
  });

  // DONE
  test('GET /users', async () => {
    const token = await getToken();

    // no token provided
    let response = await request(app).get("/users");
    expect(response.statusCode).toBe(401);

    // bad token provided
    response = await request(app).get("/users").set('authorization','Bearer 12345');
    expect(response.statusCode).toBe(401);

    // address provided
    await request(app).post("/users/addresses").set('authorization', `Bearer ${token}`).send(data.address.home);
    response = await request(app).get("/users").set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      ...data.user,
      addresses: [
        data.address.home
      ]
    });
  });

  // DONE
  test('POST /users/login', async () => {
    // create user
    let response = await request(app).post("/users").send(data.user);
    response = await request(app).post("/users/login").send({
      username: data.user.username,
      password: data.user.password
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(jwt.verify(response.body.token, TOKEN_SECRET)).toBeTruthy();
  });

  // DONE
  test('POST /users/addresses', async () => {
    const token = await getToken();
    const response = await request(app).post("/users/addresses").set('authorization', `Bearer ${token}`).send(data.address.home);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(data.address.home);
  });

  // DONE
  test('GET /users/addresses/:id?', async () => {
    const token = await getToken();
    await request(app).post("/users/addresses").set('authorization', `Bearer ${token}`).send(data.address.home);
    await request(app).post("/users/addresses").set('authorization', `Bearer ${token}`).send(data.address.work);

    // fetch basic list
    let response = await request(app).get("/users/addresses").set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toMatchObject(data.address.home);
    expect(response.body[1]).toMatchObject(data.address.work);

    // search
    response = await request(app).get("/users/addresses?number=116").set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toMatchObject(data.address.work);
  })

  // DONE
  test('PUT /users/addresses/:id', async () => {
    const token = await getToken();

    // creating address
    let response = await request(app).post("/users/addresses").set('authorization', `Bearer ${token}`).send(data.address.home);
    
    // updating address
    response = await request(app).put(`/users/addresses/${response.body._id}`).set('authorization', `Bearer ${token}`).send(data.address.work);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(data.address.work);
  });

  // DONE
  test('DELETE /users/addresses/:id', async () => {
    const token = await getToken();

    let response = await request(app).post("/users/addresses").set('authorization', `Bearer ${token}`).send(data.address.home);
    await request(app).delete(`/users/addresses/${response.body._id}`).set('authorization', `Bearer ${token}`);
    response = await request(app).get("/users/addresses").set('authorization', `Bearer ${token}`);
    expect(response.body).toEqual([]);
  })
});
