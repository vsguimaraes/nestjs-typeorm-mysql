import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { authRegisterDTOMock } from '../src/testing/auth-register-dto.mock';
import { authLoginDTOMock } from '../src/testing/auth-login-dto.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('Registrar um novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authRegisterDTOMock);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('Fazer login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authLoginDTOMock);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('accessToken');
    accessToken = response.body.accessToken;
  });

  it('Ver a lista de usuários', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(authLoginDTOMock);

    expect(response.statusCode).toEqual(200);
    //expect(response.body).toHaveProperty('accessToken');
  });
});
