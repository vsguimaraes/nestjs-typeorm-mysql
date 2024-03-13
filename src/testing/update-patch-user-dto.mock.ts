import { Role } from '../enums/role.enum';
import { UpdateUserPatchDTO } from '../user/dto/update-user-patch.dto';

export const updatePatchUserMock: UpdateUserPatchDTO = {
  name: 'Vinicius Guima',
  email: 'vini@gmail.com',
  role: Role.User,
};
