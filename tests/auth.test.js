const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Routes', () => {
  it('should login a user and return a token', async () => {
    const res = await request(app).post('/login').send({ emailId: 'test@example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return an error if email is missing', async () => {
    const res = await request(app).post('/login').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Missing required field: emailId.');
  });

  it('should return an error for invalid email format', async () => {
    const res = await request(app).post('/login').send({ emailId: 'invalid-email' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid email format.');
  });
});
