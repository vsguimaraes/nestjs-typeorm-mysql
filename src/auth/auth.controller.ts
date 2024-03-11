import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login-dto';
import { AuthRegisterDTO } from './dto/auth-register-dto';
import { AuthForgetDTO } from './dto/auth-forget-dto';
import { AuthResetDTO } from './dto/auth-reset-dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}
  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(
      body,
    ); /* para usar este create de outro módulo, eu importo pelo constructor */
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(@User() user, @UploadedFile() file: Express.Multer.File) {
    const fileNameArr = file.originalname.split('.');
    const ext = fileNameArr[fileNameArr.length - 1];
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'img',
      `photo-${user.id}.${ext}`,
    );
    try {
      await this.fileService.upload(path, file);
    } catch (e) {
      throw new BadRequestException(e);
    }
    return { status: true };
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('photos')
  async uploadPhotos(
    @User() user,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'images',
          }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 50,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return { files };
  }
}
