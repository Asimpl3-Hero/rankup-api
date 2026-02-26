import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { MockYoutubeJsonService } from '../../../../src/videos/infrastructure/mock-youtube-json.service';

describe('MockYoutubeJsonService', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'rankup-mock-'));
  });

  afterEach(async () => {
    delete process.env.MOCK_YOUTUBE_FILE_PATH;
    await rm(tempDir, { force: true, recursive: true });
  });

  it('reads videos from mock file', async () => {
    const mockPath = path.join(tempDir, 'mock.json');
    await writeFile(
      mockPath,
      JSON.stringify({
        kind: 'youtube#videoListResponse',
        items: [{ id: '1', snippet: { title: 'Video A' } }],
      }),
      'utf-8',
    );
    process.env.MOCK_YOUTUBE_FILE_PATH = mockPath;

    const service = new MockYoutubeJsonService();
    const videos = await service.getVideos();

    expect(videos).toHaveLength(1);
    expect(videos[0].id).toBe('1');
    expect(videos[0].snippet?.title).toBe('Video A');
  });

  it('uses uploaded videos in memory after successful upload', async () => {
    const mockPath = path.join(tempDir, 'mock.json');
    await writeFile(
      mockPath,
      JSON.stringify({ kind: 'youtube#videoListResponse', items: [] }),
      'utf-8',
    );
    process.env.MOCK_YOUTUBE_FILE_PATH = mockPath;

    const service = new MockYoutubeJsonService();
    const count = service.setVideosFromRawContent(
      JSON.stringify({
        kind: 'youtube#videoListResponse',
        items: [{ id: 'uploaded-1' }],
      }),
    );

    const videos = await service.getVideos();
    expect(count).toBe(1);
    expect(videos).toEqual([{ id: 'uploaded-1' }]);
  });

  it('throws bad request for invalid uploaded JSON', () => {
    const service = new MockYoutubeJsonService();

    expect(() => service.setVideosFromRawContent('{ invalid-json')).toThrow(
      BadRequestException,
    );
  });

  it('throws bad request when uploaded JSON has no items array', () => {
    const service = new MockYoutubeJsonService();

    expect(() =>
      service.setVideosFromRawContent(JSON.stringify({ kind: 'x' })),
    ).toThrow(BadRequestException);
  });

  it('throws internal server error when file does not exist', async () => {
    process.env.MOCK_YOUTUBE_FILE_PATH = path.join(tempDir, 'missing.json');
    const service = new MockYoutubeJsonService();

    await expect(service.getVideos()).rejects.toThrow(InternalServerErrorException);
  });

  it('throws internal server error when file has invalid JSON', async () => {
    const mockPath = path.join(tempDir, 'mock.json');
    await writeFile(mockPath, '{invalid-json', 'utf-8');
    process.env.MOCK_YOUTUBE_FILE_PATH = mockPath;
    const service = new MockYoutubeJsonService();

    await expect(service.getVideos()).rejects.toThrow(InternalServerErrorException);
  });

  it('throws internal server error when parsed JSON has invalid items property', async () => {
    const mockPath = path.join(tempDir, 'mock.json');
    await writeFile(
      mockPath,
      JSON.stringify({ kind: 'youtube#videoListResponse', items: 'invalid' }),
      'utf-8',
    );
    process.env.MOCK_YOUTUBE_FILE_PATH = mockPath;
    const service = new MockYoutubeJsonService();

    await expect(service.getVideos()).rejects.toThrow(InternalServerErrorException);
  });
});
