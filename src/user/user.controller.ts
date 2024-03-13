import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserPutDTO } from './dto/update-user-put.dto';
import { UpdateUserPatchDTO } from './dto/update-user-patch.dto';
import { UserService } from './user.service';
import { LogInterceptor } from '../interceptors/log.interceptor';
import { paramId } from '../decorators/param-id.decorator';
import { AuthGuard } from '../guard/auth.guard';

//@UseInterceptors(LogInterceptor) // interceptador que será executado a partir de qualquer rota users
@UseGuards(AuthGuard)
@Controller('users') // toda vez que chamar a rota users
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async create(@Body() body: CreateUserDTO) {
    /* CreateUserDTO é o padrão exigido para o objeto */
    /* toda vez que executar um metodo post em users */
    return this.userService.create(body);
  }

  @UseInterceptors(LogInterceptor)
  @Get()
  async findAll() {
    // toda vez que executar um metodo get em users
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@paramId() id: number) {
    // toda vez que executar um metodo get em users/:id
    return this.userService.findOne(id);
  }

  @Put(':id')
  async update(
    @Body()
    {
      name,
      email,
      password,
      birthAt,
    }: UpdateUserPutDTO /* o @Body() retorna um objeto que pode ser lido em uma variável (body) ou em atributos separados  */,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // toda vez que executar um metodo put em users
    return this.userService.update(id, { name, email, password, birthAt });
  }

  @Patch(':id')
  async updatePartial(
    @Body() body: UpdateUserPatchDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // toda vez que executar um metodo patch em users - não é obrigatório enviar os campos, mas quando enviados, estes serão validados
    return this.userService.updatePartial(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    // o ParseIntPipe valida o campo id, se inteiro o transforma em numérico
    return this.userService.delete(id);
  }
}
