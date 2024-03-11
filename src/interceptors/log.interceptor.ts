import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const dt = Date.now();
    console.log(`antes da execução`);
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();

        console.log(`Requisição: ${request.url}`);
        console.log(`Método: ${request.method}`);
        console.log(`Tempo de execução: ${Date.now() - dt}`);
        console.log(`depois da execução`);
      }),
    );
  }
}
