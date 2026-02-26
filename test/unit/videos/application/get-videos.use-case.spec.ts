import { GetVideosUseCase } from '../../../../src/videos/application/get-videos.use-case';
import { YoutubeVideoItemRaw } from '../../../../src/videos/application/youtube-video.types';

describe('GetVideosUseCase', () => {
  it('maps videos to response contract and sorts by hype desc', async () => {
    const videos: YoutubeVideoItemRaw[] = [
      {
        id: '1',
        snippet: {
          title: 'Tutorial Nest',
          channelTitle: 'Channel A',
          publishedAt: '2026-01-01T00:00:00.000Z',
          thumbnails: { high: { url: 'https://example.com/a.jpg' } },
        },
        statistics: { viewCount: '100', likeCount: '20', commentCount: '10' },
      },
      {
        id: '2',
        snippet: {
          title: 'Video Normal',
          channelTitle: 'Channel B',
          publishedAt: '2026-01-10T00:00:00.000Z',
          thumbnails: { high: { url: 'https://example.com/b.jpg' } },
        },
        statistics: { viewCount: '50', likeCount: '10', commentCount: '5' },
      },
      {
        id: '3',
        snippet: {
          title: 'Sin comentarios',
          channelTitle: 'Channel C',
          publishedAt: '2026-01-20T00:00:00.000Z',
          thumbnails: { high: { url: 'https://example.com/c.jpg' } },
        },
        statistics: { viewCount: '200', likeCount: '100' },
      },
    ];

    const mockYoutubeJsonService = {
      getVideos: jest.fn().mockResolvedValue(videos),
    };

    const useCase = new GetVideosUseCase(
      mockYoutubeJsonService as never,
    );

    const result = await useCase.execute();

    expect(result).toHaveLength(3);
    expect(result.map((video) => video.title)).toEqual([
      'Tutorial Nest',
      'Video Normal',
      'Sin comentarios',
    ]);
    expect(result[0].hype).toBeCloseTo(0.6);
    expect(result[1].hype).toBeCloseTo(0.3);
    expect(result[2].hype).toBe(0);
    expect(result[0].thumbnail).toBe('https://example.com/a.jpg');
    expect(typeof result[0].publishedAt).toBe('string');
  });

  it('handles invalid counters and missing snippet/statistics with safe defaults', async () => {
    const videos: YoutubeVideoItemRaw[] = [
      {
        id: '4',
        snippet: {
          title: '',
          channelTitle: '',
          publishedAt: 'invalid-date',
        },
        statistics: {
          viewCount: 'invalid-number',
          likeCount: '-20',
          commentCount: '10',
        },
      },
      {
        id: '5',
      },
    ];

    const mockYoutubeJsonService = {
      getVideos: jest.fn().mockResolvedValue(videos),
    };

    const useCase = new GetVideosUseCase(
      mockYoutubeJsonService as never,
    );

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].thumbnail).toBe('');
    expect(result[0].hype).toBe(0);
    expect(result[0].publishedAt).toBe('Hace 0 horas');
    expect(result[1]).toEqual({
      thumbnail: '',
      title: '',
      author: '',
      publishedAt: 'Hace 0 horas',
      hype: 0,
    });
  });

  it('returns hype=0 when commentCount is null', async () => {
    const videos: YoutubeVideoItemRaw[] = [
      {
        id: '6',
        snippet: {
          title: 'Video con null',
          channelTitle: 'Channel D',
          publishedAt: '2026-01-01T00:00:00.000Z',
        },
        statistics: {
          viewCount: '100',
          likeCount: '50',
          commentCount: null,
        },
      },
    ];

    const mockYoutubeJsonService = {
      getVideos: jest.fn().mockResolvedValue(videos),
    };

    const useCase = new GetVideosUseCase(mockYoutubeJsonService as never);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].hype).toBe(0);
  });
});
