import { Injectable } from '@nestjs/common';

@Injectable()
export class MockYoutubeJsonService {
  async getVideos(): Promise<unknown[]> {
    return [];
  }
}
