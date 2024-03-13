import { MailerService } from '@nestjs-modules/mailer';

export const mailerServiceMock = {
  provide: MailerService,
  useValue: {
    /* simulação de todas as consultas ao banco realizadas por jwtService */
    sendMail: jest.fn(),
  },
};
