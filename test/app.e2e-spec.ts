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

interface MockVideoItem {
  snippet?: {
    title?: string;
    channelTitle?: string;
  };
  statistics?: {
    viewCount?: string;
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
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
});
