import { Injectable } from '@nestjs/common';
import { VideoResponseDto } from '../dto/video-response.dto';
import { MockYoutubeJsonService } from '../infrastructure/mock-youtube-json.service';

@Injectable()
export class GetVideosUseCase {
  constructor(private readonly mockYoutubeJsonService: MockYoutubeJsonService) {}

  async execute(): Promise<VideoResponseDto[]> {
    await this.mockYoutubeJsonService.getVideos();
    return [];
  }
}
