import { Role } from '../enums/role.enum';
import { CreateUserDTO } from '../user/dto/create-user.dto';

export const createUserDTOMock: CreateUserDTO = {
  name: 'Vinicius Guima',
  email: 'vini@gmail.com',
  password: 'R@aecef3!THE',
  birthAt: '1988-10-25',
  role: Role.User,
};
