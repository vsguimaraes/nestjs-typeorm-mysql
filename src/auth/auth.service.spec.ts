import { Test, TestingModule } from '@nestjs/testing';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { AuthService } from './auth.service';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { UserEntityList } from '../testing/user-entity.list';
import { accessToken } from '../testing/access-token.mock';
import { jwtPayloadMock } from '../testing/jwt-payload.mock';
import { forgetToken } from '../testing/forget-token.mock';
import { registerUserMock } from '../testing/register-user-dto.mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  test('Validar a definição', () => {
    expect(authService).toBeDefined();
  });

  describe('Token', () => {
    test('createToken method', () => {
      const token = authService.createToken(UserEntityList[0]);
      expect(token).toEqual({
        accessToken,
      });
    });

    test('validateToken method', () => {
      const data = authService.validateToken(accessToken);
      expect(data).toEqual(jwtPayloadMock);
    });

    test('isValidToken method', () => {
      const data = authService.isValidToken(accessToken);
      expect(data).toEqual(true);
    });
  });

  describe('Authenticate', () => {
    test('Login method', async () => {
      const data = await authService.login('vini@gmail.com', 'R@aecef3!');
      expect(data).toEqual({
        accessToken,
      });
    });

    test('Forget method', async () => {
      const data = await authService.forget('vini@gmail.com');
      expect(data).toEqual({ status: true });
    });

    test('Reset method', async () => {
      const data = await authService.reset('R@aecef3!THE', forgetToken);
      expect(data).toEqual({
        accessToken,
      });
    });

    test('Register method', async () => {
      const data = await authService.register(registerUserMock);
      expect(data).toEqual({
        accessToken,
      });
    });
  });
});
