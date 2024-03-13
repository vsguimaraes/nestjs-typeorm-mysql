import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {
  getDestinationPath() {
    return join(__dirname, '..', '..', 'storage', 'img');
  }
  async upload(file: Express.Multer.File, filename: string) {
    const path = join(this.getDestinationPath(), filename);
    try {
      await writeFile(path, file.buffer);
      return { status: true };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
