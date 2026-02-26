import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { AppModule } from './../src/app.module';

interface VideoResponseContract {
  thumbnail: string;
  title: string;
  author: string;
  publishedAt: string;
  hype: number;
}

interface UploadMockResponseContract {
  message: string;
  itemsCount: number;
}

interface MockVideoItem {
  snippet?: {
    title?: string;
    channelTitle?: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

interface MockVideoResponse {
  items: MockVideoItem[];
}

function getMockItems(): MockVideoItem[] {
  const mockPath = path.resolve(process.cwd(), 'mock/mock-youtube-api.json');
  const raw = readFileSync(mockPath, 'utf-8');
  const parsed = JSON.parse(raw) as MockVideoResponse;
  return parsed.items ?? [];
}

function toVideoKey(title: string, author: string): string {
  return `${title}::${author}`;
}

function countByKey(keys: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const key of keys) {
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

describe('VideosController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    delete process.env.MOCK_YOUTUBE_FILE_PATH;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    delete process.env.MOCK_YOUTUBE_FILE_PATH;
  });

  it('/api/videos (GET) returns only the public contract sorted by hype desc', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/videos')
      .expect(200);

    const videos = response.body as VideoResponseContract[];
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);

    for (const video of videos) {
      expect(Object.keys(video).sort()).toEqual(
        ['thumbnail', 'title', 'author', 'publishedAt', 'hype'].sort(),
      );
      expect(typeof video.thumbnail).toBe('string');
      expect(typeof video.title).toBe('string');
      expect(typeof video.author).toBe('string');
      expect(typeof video.publishedAt).toBe('string');
      expect(typeof video.hype).toBe('number');
    }

    for (let index = 1; index < videos.length; index += 1) {
      expect(videos[index - 1].hype).toBeGreaterThanOrEqual(videos[index].hype);
    }
  });

  it('applies hype=0 when comments are missing', async () => {
    const expectedKeys = getMockItems()
      .filter((item) => item.statistics?.commentCount === undefined)
      .map((item) =>
        toVideoKey(item.snippet?.title ?? '', item.snippet?.channelTitle ?? ''),
      );
    const expectedCounts = countByKey(expectedKeys);

    const response = await request(app.getHttpServer())
      .get('/api/videos')
      .expect(200);
    const videos = response.body as VideoResponseContract[];

    const matchingVideos = videos.filter((video) =>
      expectedCounts.has(toVideoKey(video.title, video.author)),
    );
    const actualCounts = countByKey(
      matchingVideos.map((video) => toVideoKey(video.title, video.author)),
    );

    for (const [key, count] of expectedCounts) {
      expect(actualCounts.get(key) ?? 0).toBe(count);
    }

    for (const video of matchingVideos) {
      expect(video.hype).toBe(0);
    }
  });

  it('applies tutorial multiplier x2 when title includes tutorial', async () => {
    const tutorialItem = getMockItems().find((item) => {
      const title = item.snippet?.title?.toLowerCase() ?? '';
      const hasComments = item.statistics?.commentCount !== undefined;
      const views = Number(item.statistics?.viewCount ?? '0');
      return title.includes('tutorial') && hasComments && views > 0;
    });

    expect(tutorialItem).toBeDefined();

    const likes = Number(tutorialItem?.statistics?.likeCount ?? '0');
    const comments = Number(tutorialItem?.statistics?.commentCount ?? '0');
    const views = Number(tutorialItem?.statistics?.viewCount ?? '1');
    const expectedHype = ((likes + comments) / views) * 2;

    const response = await request(app.getHttpServer())
      .get('/api/videos')
      .expect(200);
    const videos = response.body as VideoResponseContract[];

    const targetVideo = videos.find(
      (video) =>
        video.title === (tutorialItem?.snippet?.title ?? '') &&
        video.author === (tutorialItem?.snippet?.channelTitle ?? ''),
    );

    expect(targetVideo).toBeDefined();
    expect(targetVideo?.hype).toBeCloseTo(expectedHype);
  });

  it('applies hype=0 when views are zero', async () => {
    const expectedKeys = getMockItems()
      .filter((item) => Number(item.statistics?.viewCount) === 0)
      .map((item) =>
        toVideoKey(item.snippet?.title ?? '', item.snippet?.channelTitle ?? ''),
      );
    const expectedCounts = countByKey(expectedKeys);

    const response = await request(app.getHttpServer())
      .get('/api/videos')
      .expect(200);
    const videos = response.body as VideoResponseContract[];

    const matchingVideos = videos.filter((video) =>
      expectedCounts.has(toVideoKey(video.title, video.author)),
    );
    const actualCounts = countByKey(
      matchingVideos.map((video) => toVideoKey(video.title, video.author)),
    );

    for (const [key, count] of expectedCounts) {
      expect(actualCounts.get(key) ?? 0).toBe(count);
    }

    for (const video of matchingVideos) {
      expect(video.hype).toBe(0);
    }
  });

  it('returns 500 when mock file path is invalid', async () => {
    await app.close();
    process.env.MOCK_YOUTUBE_FILE_PATH = 'mock/not-found.json';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    await request(app.getHttpServer()).get('/api/videos').expect(500);
  });

  it('uploads a mock JSON file and uses it on GET /api/videos', async () => {
    const uploadedMock = {
      kind: 'youtube#videoListResponse',
      items: [
        {
          id: 'video-1',
          snippet: {
            title: 'Tutorial de NestJS',
            channelTitle: 'Channel A',
            publishedAt: '2026-02-20T12:00:00.000Z',
            thumbnails: { high: { url: 'https://example.com/1.jpg' } },
          },
          statistics: {
            viewCount: '100',
            likeCount: '20',
            commentCount: '10',
          },
        },
        {
          id: 'video-2',
          snippet: {
            title: 'Video sin comentarios',
            channelTitle: 'Channel B',
            publishedAt: '2026-02-22T12:00:00.000Z',
            thumbnails: { high: { url: 'https://example.com/2.jpg' } },
          },
          statistics: {
            viewCount: '200',
            likeCount: '100',
          },
        },
      ],
    };

    const uploadResponse = await request(app.getHttpServer())
      .post('/api/videos/mock')
      .attach(
        'file',
        Buffer.from(JSON.stringify(uploadedMock), 'utf-8'),
        'uploaded-mock.json',
      )
      .expect(201);

    const uploadBody = uploadResponse.body as UploadMockResponseContract;
    expect(uploadBody.message).toBe('Mock uploaded successfully.');
    expect(uploadBody.itemsCount).toBe(2);

    const videosResponse = await request(app.getHttpServer())
      .get('/api/videos')
      .expect(200);

    const videos = videosResponse.body as VideoResponseContract[];
    expect(videos).toHaveLength(2);
    expect(videos[0].title).toBe('Tutorial de NestJS');
    expect(videos[0].hype).toBeCloseTo(0.6);
    expect(videos[1].title).toBe('Video sin comentarios');
    expect(videos[1].hype).toBe(0);
  });

  it('returns 400 when uploaded mock file is invalid JSON', async () => {
    await request(app.getHttpServer())
      .post('/api/videos/mock')
      .attach('file', Buffer.from('{ invalid json', 'utf-8'), 'broken.json')
      .expect(400);
  });
});
