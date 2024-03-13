import { Role } from '../enums/role.enum';
import { UpdateUserPutDTO } from '../user/dto/update-user-put.dto';

export const updatePutUserMock: UpdateUserPutDTO = {
  name: 'Vinicius Guima',
  email: 'vini@gmail.com',
  password: 'R@aecef3!THE',
  birthAt: '1988-10-25',
  role: Role.User,
};
