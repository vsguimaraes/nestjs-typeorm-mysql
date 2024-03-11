import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    try {
      const data = this.authService.validateToken((token ?? '').split(' ')[1]);
      request.tokenPayLoad = data;
      request.user = await this.userService.findOne(data.id);
      return true;
    } catch (e) {
      return false;
    }
    if (!token) {
      return false;
    }
    return true;
  }
}
