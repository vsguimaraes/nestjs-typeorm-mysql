import { Role } from '../enums/role.enum';
import { User } from '../user/entity/user.entity';

export const UserEntityList: User[] = [
  {
    id: 1,
    name: 'Vinicius Guima',
    email: 'vini@gmail.com',
    password: '$2b$10$RbFtUUiGLIGuSkep5m4QNea82yv3oB1aAEBRL3EtVxhDh2l862iHO',
    birthAt: new Date('1988-10-25'),
    role: Role.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Maisa Regina',
    email: 'maisa@gmail.com',
    password: '$2b$10$RbFtUUiGLIGuSkep5m4QNea82yv3oB1aAEBRL3EtVxhDh2l862iHO',
    birthAt: new Date('1988-10-25'),
    role: Role.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Lenilda Luz',
    email: 'lenilda@gmail.com',
    password: '$2b$10$RbFtUUiGLIGuSkep5m4QNea82yv3oB1aAEBRL3EtVxhDh2l862iHO',
    birthAt: new Date('1988-10-25'),
    role: Role.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
