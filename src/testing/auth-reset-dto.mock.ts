import { AuthResetDTO } from '../auth/dto/auth-reset-dto';
import { forgetToken } from './forget-token.mock';

export const authResetDTOMock: AuthResetDTO = {
  password: 'R@aecef3!THE',
  token: forgetToken,
};
