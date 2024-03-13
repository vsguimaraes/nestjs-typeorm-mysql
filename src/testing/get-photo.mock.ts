import { join } from 'path';
import { getFileToBuffer } from './get-file-to-buffer';

export const getPhoto = async () => {
  const { buffer, stream } = await getFileToBuffer(
    join(__dirname, 'photo.jpeg'),
  );

  const photo: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'photo.jpeg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: '',
    size: 50 * 1024,
    filename: 'file-name',
    path: 'file-path',
    stream: stream,
    buffer: buffer,
  };

  return photo;
};
