import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { YoutubeVideoItemRaw, YoutubeVideoListResponseRaw } from '../application/youtube-video.types';

@Injectable()
export class MockYoutubeJsonService {
  private readonly mockFilePath = path.resolve(process.cwd(), 'mock-youtube-api.json');

  async getVideos(): Promise<YoutubeVideoItemRaw[]> {
    const rawContent = await this.readMockFile();
    const parsedData = this.parseMockContent(rawContent);

    if (!Array.isArray(parsedData.items)) {
      throw new InternalServerErrorException('Mock file does not contain a valid items array.');
    }

    return parsedData.items;
  }

  private async readMockFile(): Promise<string> {
    try {
      return await readFile(this.mockFilePath, { encoding: 'utf-8' });
    } catch {
      throw new InternalServerErrorException('Could not read mock-youtube-api.json file.');
    }
  }

  private parseMockContent(rawContent: string): YoutubeVideoListResponseRaw {
    try {
      return JSON.parse(rawContent) as YoutubeVideoListResponseRaw;
    } catch {
      throw new InternalServerErrorException('mock-youtube-api.json is not valid JSON.');
    }
  }
}
