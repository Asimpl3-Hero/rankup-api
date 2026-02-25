import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface VideoResponseContract {
  thumbnail: string;
  title: string;
  author: string;
  publishedAt: string;
  hype: number;
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
    const response = await request(app.getHttpServer()).get('/api/videos').expect(200);

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
    const response = await request(app.getHttpServer()).get('/api/videos').expect(200);
    const videos = response.body as VideoResponseContract[];

    const polemicaVideos = videos.filter((video) => video.title.includes('POL'));
    expect(polemicaVideos.length).toBe(2);

    for (const video of polemicaVideos) {
      expect(video.hype).toBe(0);
    }
  });

  it('applies hype=0 when views are zero', async () => {
    const response = await request(app.getHttpServer()).get('/api/videos').expect(200);
    const videos = response.body as VideoResponseContract[];

    const zeroViewVideos = videos.filter((video) => video.title.includes('Hola Mundo'));
    expect(zeroViewVideos.length).toBe(2);

    for (const video of zeroViewVideos) {
      expect(video.hype).toBe(0);
    }
  });
});
