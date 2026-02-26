import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { YoutubeVideoItemRaw, YoutubeVideoListResponseRaw } from '../application/youtube-video.types';

@Injectable()
export class MockYoutubeJsonService {
  private readonly mockFilePath = this.resolveMockFilePath();
  private uploadedVideos: YoutubeVideoItemRaw[] | null = null;

  async getVideos(): Promise<YoutubeVideoItemRaw[]> {
    if (this.uploadedVideos !== null) {
      return this.uploadedVideos;
    }

    const rawContent = await this.readMockFile();
    const parsedData = this.parseMockContent(rawContent);

    if (!Array.isArray(parsedData.items)) {
      throw new InternalServerErrorException('Mock file does not contain a valid items array.');
    }

    return parsedData.items;
  }

  setVideosFromRawContent(rawContent: string): number {
    let parsedData: YoutubeVideoListResponseRaw;

    try {
      parsedData = JSON.parse(rawContent) as YoutubeVideoListResponseRaw;
    } catch {
      throw new BadRequestException(
        'Uploaded file is not valid JSON.',
      );
    }

    if (!Array.isArray(parsedData.items)) {
      throw new BadRequestException(
        'Uploaded JSON must contain a valid items array.',
      );
    }

    this.uploadedVideos = parsedData.items;
    return parsedData.items.length;
  }

  private async readMockFile(): Promise<string> {
    try {
      return await readFile(this.mockFilePath, { encoding: 'utf-8' });
    } catch {
      throw new InternalServerErrorException(
        `Could not read mock file at path "${this.mockFilePath}".`,
      );
    }
  }

  private parseMockContent(rawContent: string): YoutubeVideoListResponseRaw {
    try {
      return JSON.parse(rawContent) as YoutubeVideoListResponseRaw;
    } catch {
      throw new InternalServerErrorException(
        `Mock file at path "${this.mockFilePath}" is not valid JSON.`,
      );
    }
  }

  private resolveMockFilePath(): string {
    const configuredPath =
      process.env.MOCK_YOUTUBE_FILE_PATH ?? 'mock/mock-youtube-api.json';

    if (path.isAbsolute(configuredPath)) {
      return configuredPath;
    }

    return path.resolve(process.cwd(), configuredPath);
  }
}
