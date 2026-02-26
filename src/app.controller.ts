import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      docs: '/api/docs',
      name: 'rankup-api',
      status: 'ok',
      videos: '/api/videos',
    };
  }
}
