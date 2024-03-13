import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserCheckIdMiddleware } from '../middlewares/user-check-id.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  /* forwardRef serve para resolver problemas relacionados à dependência circular */
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
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
