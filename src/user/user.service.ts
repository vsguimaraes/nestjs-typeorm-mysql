import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserPatchDTO } from './dto/update-user-patch.dto';
import { UpdateUserPutDTO } from './dto/update-user-put.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ name, email, password, birthAt }: CreateUserDTO) {
    /* em caso de return eu posso ocultar o await que ele funciona da mesma forma */
    password = await bcrypt.hash(password, await bcrypt.genSalt());
    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    await this.exists(id);
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    { name, email, password, birthAt }: UpdateUserPutDTO,
  ) {
    await this.exists(id);
    password = await bcrypt.hash(password, await bcrypt.genSalt());
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
    });
  }

  async updatePartial(
    id: number,
    { name, email, password, birthAt }: UpdateUserPatchDTO,
  ) {
    await this.exists(id);
    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    // eslint-disable-next-line prettier/prettier
    if (password) data.password = await bcrypt.hash(password, await bcrypt.genSalt());
    if (birthAt) data.birthAt = new Date(birthAt);

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    /* verifica a existência de usuários no banco */
    const user = await this.prisma.user.count({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`O usuário ${id} não existe!`);
    }
  }
}
