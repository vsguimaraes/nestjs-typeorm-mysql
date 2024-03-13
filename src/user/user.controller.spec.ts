import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { userServiceMock } from '../testing/user-service.mock';
import { AuthGuard } from '../guard/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { UserService } from './user.service';
import { createUserDTOMock } from '../testing/create-user-dto.mock';
import { UserEntityList } from '../testing/user-entity.list';
import { updatePutUserMock } from '../testing/update-put-user-dto.mock';
import { updatePatchUserMock } from '../testing/update-patch-user-dto.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  test('Validar a definição', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Teste da aplicação do guard', () => {
    test('Se o Guard está aplicado', () => {
      const guards = Reflect.getMetadata('__guards__', UserController);
      expect(guards.length).toEqual(1);
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
    });
  });

  describe('Create', () => {
    test('create method', async () => {
      const data = await userController.create(createUserDTOMock);
      expect(data).toEqual(UserEntityList[1]);
    });
  });

  describe('Read', () => {
    test('findAll method', async () => {
      const data = await userController.findAll();
      expect(data).toEqual(UserEntityList);
    });

    test('findOne method', async () => {
      const data = await userController.findOne(1);
      expect(data).toEqual(UserEntityList[1]);
    });
  });

  describe('Update', () => {
    test('update method', async () => {
      const data = await userController.update(updatePutUserMock, 1);
      expect(data).toEqual(UserEntityList[1]);
    });

    test('updatePartial method', async () => {
      const data = await userController.updatePartial(updatePatchUserMock, 1);
      expect(data).toEqual(UserEntityList[1]);
    });
  });

  describe('Delete', () => {
    test('delete method', async () => {
      const data = await userController.delete(1);
      expect(data).toEqual({ status: true });
    });
  });
});
