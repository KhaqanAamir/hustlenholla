import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('AuthController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/sign-up (POST) - should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'SUPER_ADMIN',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: false,
        msg: expect.any(String),
        data: expect.objectContaining({
          accessToken: expect.any(String),
          expiresAt: expect.any(Number),
          email: 'test@example.com',
          id: expect.any(Number),
        }),
        status: 200,
      }),
    );
  });

  it.only('/auth/sign-up (POST) - should return error for duplicate email', async () => {

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'SUPER_ADMIN',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: true,
        msg: 'User already exists',
        data: null,
        status: 400,
      }),
    );
  })
});