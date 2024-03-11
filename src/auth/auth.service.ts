import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register-dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
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
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
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
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
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

    return true;
  }
  async reset(password: string, token: string) {
    try {
      const data = this.validateToken(token, 'forget');

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Token de acesso inválido!');
      }

      password = await bcrypt.hash(password, await bcrypt.genSalt());

      const user = await this.prisma.user.update({
        data: {
          password,
        },
        where: {
          id: data.id,
        },
      });

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
