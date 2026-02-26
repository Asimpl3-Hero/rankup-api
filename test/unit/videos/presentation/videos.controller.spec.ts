import { BadRequestException } from '@nestjs/common';
import { VideosController } from '../../../../src/videos/presentation/videos.controller';

describe('VideosController', () => {
  it('returns processed videos from use case', async () => {
    const getVideosUseCase = {
      execute: jest.fn().mockResolvedValue([
        {
          thumbnail: 'https://example.com/thumb.jpg',
          title: 'Video A',
          author: 'Channel A',
          publishedAt: 'Hace 2 dias',
          hype: 0.42,
        },
      ]),
    };
    const uploadMockVideosUseCase = { execute: jest.fn() };

    const controller = new VideosController(
      getVideosUseCase as never,
      uploadMockVideosUseCase as never,
    );

    await expect(controller.getVideos()).resolves.toEqual([
      {
        thumbnail: 'https://example.com/thumb.jpg',
        title: 'Video A',
        author: 'Channel A',
        publishedAt: 'Hace 2 dias',
        hype: 0.42,
      },
    ]);
    expect(getVideosUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('throws bad request when file is missing', () => {
    const controller = new VideosController(
      { execute: jest.fn() } as never,
      { execute: jest.fn() } as never,
    );

    expect(() => controller.uploadMockFile(undefined)).toThrow(
      BadRequestException,
    );
  });

  it('uploads mock file content and returns summary', () => {
    const uploadMockVideosUseCase = {
      execute: jest.fn().mockReturnValue(3),
    };

    const controller = new VideosController(
      { execute: jest.fn() } as never,
      uploadMockVideosUseCase as never,
    );

    const response = controller.uploadMockFile({
      buffer: Buffer.from('{"items":[1,2,3]}', 'utf-8'),
    });

    expect(uploadMockVideosUseCase.execute).toHaveBeenCalledWith(
      '{"items":[1,2,3]}',
    );
    expect(response).toEqual({
      message: 'Mock uploaded successfully.',
      itemsCount: 3,
    });
  });
});
