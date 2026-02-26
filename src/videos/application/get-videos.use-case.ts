import { Injectable } from '@nestjs/common';
import { calculateHype } from '../domain/calculate-hype';
import { formatPublishedAt } from '../domain/format-published-at';
import { VideoResponseDto } from '../dto/video-response.dto';
import { MockYoutubeJsonService } from '../infrastructure/mock-youtube-json.service';
import { YoutubeVideoItemRaw } from './youtube-video.types';

@Injectable()
export class GetVideosUseCase {
  constructor(private readonly mockYoutubeJsonService: MockYoutubeJsonService) {}

  async execute(): Promise<VideoResponseDto[]> {
    const videos = await this.mockYoutubeJsonService.getVideos();
    const transformedVideos = videos.map((video) => this.mapToResponse(video));
    return transformedVideos.sort((videoA, videoB) => videoB.hype - videoA.hype);
  }

  private mapToResponse(video: YoutubeVideoItemRaw): VideoResponseDto {
    const title = video.snippet?.title ?? '';
    const views = this.parseCount(video.statistics?.viewCount);
    const likes = this.parseCount(video.statistics?.likeCount);
    const commentsRaw = video.statistics?.commentCount;

    return {
      thumbnail: video.snippet?.thumbnails?.high?.url ?? '',
      title,
      author: video.snippet?.channelTitle ?? '',
      publishedAt: formatPublishedAt(video.snippet?.publishedAt ?? ''),
      hype: calculateHype({
        title,
        views,
        likes,
        comments: commentsRaw == null ? null : this.parseCount(commentsRaw),
      }),
    };
  }

  private parseCount(rawValue: string | undefined): number {
    if (rawValue === undefined) {
      return 0;
    }

    const parsedValue = Number(rawValue);
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return 0;
    }

    return parsedValue;
  }
}
