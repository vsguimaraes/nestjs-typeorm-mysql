import { AuthRegisterDTO } from '../auth/dto/auth-register-dto';
import { Role } from '../enums/role.enum';

export const authRegisterDTOMock: AuthRegisterDTO = {
  name: 'Vinicius Guima',
  email: 'vini@gmail.com',
  password: 'R@aecef3!THE',
  birthAt: '1988-10-25',
  role: Role.User,
};
