import { Module } from '@nestjs/common';
import { GetVideosUseCase } from './application/get-videos.use-case';
import { UploadMockVideosUseCase } from './application/upload-mock-videos.use-case';
import { MockYoutubeJsonService } from './infrastructure/mock-youtube-json.service';
import { VideosController } from './presentation/videos.controller';

@Module({
  controllers: [VideosController],
  providers: [GetVideosUseCase, UploadMockVideosUseCase, MockYoutubeJsonService],
})
export class VideosModule {}
