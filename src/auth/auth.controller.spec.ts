import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { authServiceMock } from '../testing/auth-service.mock';
import { guardMock } from '../testing/guard.mock';
import { AuthGuard } from '../guard/auth.guard';
import { fileServiceMock } from '../testing/file-service.mock';
import { authLoginDTOMock } from '../testing/auth-login-dto.mock';
import { accessToken } from '../testing/access-token.mock';
import { authRegisterDTOMock } from '../testing/auth-register-dto.mock';
import { authForgetDTOMock } from '../testing/auth-forget-dto.mock';
import { authResetDTOMock } from '../testing/auth-reset-dto.mock';
import { getPhoto } from '../testing/get-photo.mock';
import { UserEntityList } from '../testing/user-entity.list';

describe('AuthController', () => {
  let authController: AuthController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock, fileServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  test('Validar a definição', () => {
    expect(authController).toBeDefined();
  });

  /*describe('Teste da aplicação do guard', () => {
    test('Se o Guard está aplicado', () => {
      const guards = Reflect.getMetadata('__guards__', AuthController);
      expect(guards.length).toEqual(1);
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
    });
  });*/

  describe('Authenticate', () => {
    test('Login method', async () => {
      const data = await authController.login(authLoginDTOMock);
      expect(data).toEqual({
        accessToken,
      });
    });
  });

  describe('Register', () => {
    test('Register method', async () => {
      const data = await authController.register(authRegisterDTOMock);
      expect(data).toEqual({
        accessToken,
      });
    });
  });

  describe('Recovery', () => {
    test('forget method', async () => {
      const data = await authController.forget(authForgetDTOMock);
      expect(data).toEqual({
        status: true,
      });
    });

    test('reset method', async () => {
      const data = await authController.reset(authResetDTOMock);
      expect(data).toEqual({
        accessToken,
      });
    });
  });

  describe('Authenticated routes', () => {
    test('Upload photo method', async () => {
      const photo = await getPhoto();
      const data = await authController.uploadPhoto(UserEntityList[0], photo);
      expect(data).toEqual({ status: true });
    });
  });
});
