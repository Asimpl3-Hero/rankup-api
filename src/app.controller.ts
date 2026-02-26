import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller('health')
export class AppController {
  @Get()
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
}
