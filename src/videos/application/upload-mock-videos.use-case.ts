import { Injectable } from '@nestjs/common';
import { MockYoutubeJsonService } from '../infrastructure/mock-youtube-json.service';

@Injectable()
export class UploadMockVideosUseCase {
  constructor(private readonly mockYoutubeJsonService: MockYoutubeJsonService) {}

  execute(rawMockContent: string): number {
    return this.mockYoutubeJsonService.setVideosFromRawContent(rawMockContent);
  }
}
