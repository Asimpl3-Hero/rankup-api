import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetVideosUseCase } from '../application/get-videos.use-case';
import { VideoResponseDto } from '../dto/video-response.dto';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly getVideosUseCase: GetVideosUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List videos processed for frontend consumption' })
  @ApiOkResponse({ type: VideoResponseDto, isArray: true })
  @ApiInternalServerErrorResponse({
    description:
      'Error leyendo o parseando el archivo mock configurado, o estructura invalida en items.',
  })
  async getVideos(): Promise<VideoResponseDto[]> {
    return this.getVideosUseCase.execute();
  }
}
