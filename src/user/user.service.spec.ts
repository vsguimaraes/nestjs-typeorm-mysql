import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { UserEntityList } from '../testing/user-entity.list';
import { createUserDTOMock } from '../testing/create-user-dto.mock';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { updatePatchUserMock } from '../testing/update-patch-user-dto.mock';
import { updatePutUserMock } from '../testing/update-put-user-dto.mock';

/* inicialização de rotina para testes com os módulos */
describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    /* para testes com os módulos são criadas rotinas fake, exemplo: uma instância fake do módulo UserService é feita da forma abaixo (userRepositoryMock simula o original) */
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile();
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  test('Validar a definição', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create', () => {
    test('create method', async () => {
      /* esta função spyOn troca temporariamente o valor de existsBy em userRepository para false - no mock ele está definido como true - serve apenas para validar o teste */
      jest.spyOn(userRepository, 'existsBy').mockResolvedValueOnce(false);
      const data = await userService.create(createUserDTOMock);
      expect(data).toEqual(UserEntityList[0]);
    });
  });

  describe('Read', () => {
    test('findAll method', async () => {
      const data = await userService.findAll();
      expect(data).toEqual(UserEntityList);
    });

    test('findOne method', async () => {
      const data = await userService.findOne(1);
      expect(data).toEqual(UserEntityList[0]);
    });
  });

  describe('Update', () => {
    test('update method', async () => {
      const data = await userService.update(1, updatePutUserMock);
      expect(data).toEqual(UserEntityList[0]);
    });

    test('updatePartial method', async () => {
      const data = await userService.updatePartial(1, updatePatchUserMock);
      expect(data).toEqual(UserEntityList[0]);
    });
  });

  describe('Delete', () => {
    test('delete method', async () => {
      const data = await userService.delete(1);
      expect(data).toEqual({ status: true });
    });
  });
});
