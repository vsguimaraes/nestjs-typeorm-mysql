import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { UserEntityList } from './user-entity.list';

export const userRepositoryMock = {
  provide: getRepositoryToken(User),
  useValue: {
    /* simulação de todas as consultas ao banco realizadas por userRepository */
    existsBy: jest.fn().mockResolvedValue(true),
    create: jest.fn().mockResolvedValue(UserEntityList[0]),
    save: jest.fn().mockResolvedValue(UserEntityList[0]),
    find: jest.fn().mockResolvedValue(UserEntityList),
    findOneBy: jest.fn().mockResolvedValue(UserEntityList[0]),
    update: jest.fn().mockResolvedValue(UserEntityList[0]),
    delete: jest.fn().mockResolvedValue({ status: true }),
  },
};
