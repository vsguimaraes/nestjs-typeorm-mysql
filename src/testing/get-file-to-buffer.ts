import { createReadStream } from 'fs';
import { Readable } from 'stream';

export const getFileToBuffer = (filename) => {
  const readStream = createReadStream(filename);
  const chunks = [];

  return new Promise<{ buffer: Buffer; stream: Readable }>(
    (resolve, reject) => {
      readStream.on('data', (chunk) => chunks.push(chunk));
      readStream.on('error', (err) => reject(err));
      readStream.on('close', () => {
        resolve({
          buffer: Buffer.concat(chunks) as Buffer,
          stream: readStream,
        });
      });
    },
  );
};
