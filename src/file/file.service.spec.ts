import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { getPhoto } from '../testing/get-photo.mock';

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  it('Validar a definição', () => {
    expect(fileService).toBeDefined();
  });

  describe('Upload test', () => {
    it('Upload method', async () => {
      const fileName = 'photo-test.jpeg';
      const photo = await getPhoto();
      await fileService.upload(photo, fileName);
    });
  });
});
