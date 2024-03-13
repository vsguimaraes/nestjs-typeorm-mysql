import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from './dto/auth-register-dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }
  validateToken(token: string, issuer: string = this.issuer) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: issuer,
        audience: this.audience,
      }); /* é possível uma verificação dos parâmetros passados - Ex: se o issuer não for login dará exceção */
      return data;
    } catch (e) {
      throw new JsonWebTokenError(e);
    }
  }

  isValidToken(token: string) {
    try {
      this.validateToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return this.createToken(user);
    } else {
      throw new UnauthorizedException('Usuário e/ou senha inválidos!');
    }
  }
  async forget(email: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos!');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: this.audience,
      },
    );

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperação de senha',
      template: 'forget-password',
      context: {
        name: user.name,
        token,
      },
    });

    return { status: true };
  }
  async reset(password: string, token: string) {
    try {
      const data = this.validateToken(token, 'forget');

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Token de acesso inválido!');
      }

      password = await bcrypt.hash(password, await bcrypt.genSalt());

      await this.usersRepository.update(data.id, {
        password,
      });

      const user = await this.userService.findOne(Number(data.id));

      return this.createToken(user);
    } catch (e) {
      throw new JsonWebTokenError(e);
    }
  }

  async register({ name, email, password, birthAt }: AuthRegisterDTO) {
    const user = await this.userService.create({
      name,
      email,
      password,
      birthAt,
    });

    return this.createToken(user);
  }
}
