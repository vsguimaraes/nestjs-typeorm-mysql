import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserCheckIdMiddleware } from 'src/middlewares/user-check-id.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] /* exportando para usar em outro módulo */,
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /* configuração do middleware para a rota users */
    consumer.apply(UserCheckIdMiddleware).forRoutes({
      path: '/users/:id',
      method: RequestMethod.ALL,
    });
  }
}
