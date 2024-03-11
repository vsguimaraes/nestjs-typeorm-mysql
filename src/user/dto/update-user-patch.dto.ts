import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserPatchDTO extends PartialType(CreateUserDTO) {}

/* aproveito todo o esquema definido em CreateUserDTO - a rigor, os campos funcionam de forma semelhante em relação à validação. */
/* o partialType serve para manipular dados via patch, que por sua vez os alteram de forma parcial */
/* não é obrigatório enviar todos os campos, entretanto todos os enviados serão devidamente validados */
