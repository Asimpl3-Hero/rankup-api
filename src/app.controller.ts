import { Controller, Get, Redirect } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({
    summary: 'Healthcheck del backend',
    description:
      'Endpoint de salud para verificar rapidamente que la API esta levantada.',
  })
  @ApiOkResponse({
    description: 'Servicio operativo.',
    schema: {
      example: {
        status: 'ok'
      },
    },
  })
  getHealth() {
    return {
      status: 'ok'
    };
  }

  @Get()
  @Redirect('/health', 302)
  @ApiExcludeEndpoint()
  redirectToHealth() {}
}
