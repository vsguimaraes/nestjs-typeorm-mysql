import { UserService } from '../user/user.service';
import { UserEntityList } from './user-entity.list';

export const userServiceMock = {
  provide: UserService,
  useValue: {
    /* simulação de todas as consultas ao banco realizadas por jwtService */
    findOne: jest.fn().mockResolvedValue(UserEntityList[1]),
    create: jest.fn().mockResolvedValue(UserEntityList[1]),
    findAll: jest.fn().mockResolvedValue(UserEntityList),
    update: jest.fn().mockResolvedValue(UserEntityList[1]),
    updatePartial: jest.fn().mockResolvedValue(UserEntityList[1]),
    delete: jest.fn().mockResolvedValue({ status: true }),
    exists: jest.fn().mockResolvedValue(true),
  },
};
