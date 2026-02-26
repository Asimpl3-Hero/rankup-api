import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetVideosUseCase } from '../application/get-videos.use-case';
import { UploadMockVideosUseCase } from '../application/upload-mock-videos.use-case';
import { UploadMockResponseDto } from '../dto/upload-mock-response.dto';
import { VideoResponseDto } from '../dto/video-response.dto';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(
    private readonly getVideosUseCase: GetVideosUseCase,
    private readonly uploadMockVideosUseCase: UploadMockVideosUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener videos listos para frontend',
    description:
      'Lee el mock de YouTube, transforma cada item al contrato publico y retorna la lista ordenada por hype descendente.\n\n' +
      'Reglas de hype aplicadas por el dominio:\n' +
      '- Formula base: (likes + comments) / views\n' +
      '- Si el titulo contiene "tutorial" (case insensitive), el hype final se multiplica por 2\n' +
      '- Si comments no existe en la data, hype = 0\n' +
      '- Si views = 0, hype = 0',
  })
  @ApiOkResponse({
    type: VideoResponseDto,
    isArray: true,
    description:
      'Lista de videos procesados y ordenados por hype de mayor a menor.',
    schema: {
      example: [
        {
          thumbnail: 'https://via.placeholder.com/300x200/282c34/61dafb',
          title: 'TailwindCSS errores comunes',
          author: 'Rankup Channel',
          publishedAt: 'Hace 2 meses',
          hype: 0.42,
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({
    description:
      'No se pudo leer/parsing el archivo mock o su estructura no contiene un arreglo valido en "items".',
  })
  async getVideos(): Promise<VideoResponseDto[]> {
    return this.getVideosUseCase.execute();
  }

  @Post('mock')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir mock JSON de videos',
    description:
      'Permite cargar un archivo JSON desde Swagger para reemplazar en caliente la fuente mock consumida por GET /api/videos.\n\n' +
      'Este endpoint se creo para pruebas manuales y demos, y no rompe lo requerido en el reto: GET /api/videos sigue siendo el endpoint principal de consumo.\n\n' +
      'El mock subido vive en memoria del proceso (no persiste, no comparte entre replicas).\n' +
      'La persistencia actual es de entorno dev/demo.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Archivo JSON con estructura tipo respuesta de YouTube (debe incluir propiedad "items").',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: UploadMockResponseDto,
    description:
      'Mock cargado correctamente y disponible para GET /api/videos durante la vida del proceso actual (solo dev/demo).',
  })
  @ApiBadRequestResponse({
    description:
      'No se envio archivo o el contenido no es JSON valido con arreglo items.',
  })
  uploadMockFile(
    @UploadedFile() file: { buffer: Buffer } | undefined,
  ): UploadMockResponseDto {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    const rawContent = file.buffer.toString('utf-8');
    const itemsCount = this.uploadMockVideosUseCase.execute(rawContent);

    return {
      itemsCount,
      message: 'Mock uploaded successfully.',
    };
  }
}
