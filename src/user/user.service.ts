import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserPatchDTO } from './dto/update-user-patch.dto';
import { UpdateUserPutDTO } from './dto/update-user-put.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create({ name, email, password, birthAt }: CreateUserDTO) {
    if (await this.usersRepository.existsBy({ email })) {
      throw new BadRequestException(
        'Este e-mail já está cadastrado em nossa base!',
      );
    }
    password = await bcrypt.hash(password, await bcrypt.genSalt());
    const user = await this.usersRepository.create({
      name,
      email,
      password,
      birthAt: birthAt ? new Date(birthAt) : null,
    });
    /* em caso de return eu posso ocultar o await que ele funciona da mesma forma */
    return this.usersRepository.save(user);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    await this.exists(id);
    return this.usersRepository.findOneBy({
      id,
    });
  }

  async update(
    id: number,
    { name, email, password, birthAt }: UpdateUserPutDTO,
  ) {
    await this.exists(id);
    password = await bcrypt.hash(password, await bcrypt.genSalt());
    await this.usersRepository.update(id, {
      name,
      email,
      password,
      birthAt: birthAt ? new Date(birthAt) : null,
    });

    return this.findOne(id);
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
    if (password)
      data.password = await bcrypt.hash(password, await bcrypt.genSalt());
    if (birthAt) data.birthAt = new Date(birthAt);

    await this.usersRepository.update(id, data);

    return this.findOne(id);
  }

  async delete(id: number) {
    await this.exists(id);

    await this.usersRepository.delete({
      id,
    });

    return { status: true };
  }

  async exists(id: number) {
    /* verifica a existência de usuários no banco */
    const user = await this.usersRepository.existsBy({
      id,
    });
    if (!user) {
      throw new NotFoundException(`O usuário ${id} não existe!`);
    }

    return true;
  }
}
