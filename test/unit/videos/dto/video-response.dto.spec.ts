import { UploadMockResponseDto } from '../../../../src/videos/dto/upload-mock-response.dto';
import { VideoResponseDto } from '../../../../src/videos/dto/video-response.dto';

describe('DTO contracts', () => {
  it('creates VideoResponseDto shape', () => {
    const dto: VideoResponseDto = {
      thumbnail: 'https://example.com/thumb.jpg',
      title: 'Video Title',
      author: 'Channel',
      publishedAt: 'Hace 2 dias',
      hype: 0.42,
    };

    expect(dto.thumbnail).toContain('https://');
    expect(dto.hype).toBeGreaterThanOrEqual(0);
  });

  it('creates UploadMockResponseDto shape', () => {
    const dto: UploadMockResponseDto = {
      message: 'Mock uploaded successfully.',
      itemsCount: 5,
    };

    expect(dto.message).toContain('uploaded');
    expect(dto.itemsCount).toBe(5);
  });
});
