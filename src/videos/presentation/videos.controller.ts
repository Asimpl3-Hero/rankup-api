import { Controller, Get } from '@nestjs/common';
import { GetVideosUseCase } from '../application/get-videos.use-case';
import { VideoResponseDto } from '../dto/video-response.dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly getVideosUseCase: GetVideosUseCase) {}

  @Get()
  async getVideos(): Promise<VideoResponseDto[]> {
    return this.getVideosUseCase.execute();
  }
}
