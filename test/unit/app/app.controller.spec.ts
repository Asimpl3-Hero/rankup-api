import { AppController } from '../../../src/app.controller';

describe('AppController', () => {
  it('returns service health status', () => {
    const controller = new AppController();
    expect(controller.getHealth()).toEqual({ status: 'ok' });
  });
});
