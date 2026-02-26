import { UploadMockVideosUseCase } from '../../../../src/videos/application/upload-mock-videos.use-case';

describe('UploadMockVideosUseCase', () => {
  it('delegates raw content to infrastructure service and returns items count', () => {
    const mockYoutubeJsonService = {
      setVideosFromRawContent: jest.fn().mockReturnValue(7),
    };

    const useCase = new UploadMockVideosUseCase(
      mockYoutubeJsonService as never,
    );

    const count = useCase.execute('{"items":[]}');

    expect(count).toBe(7);
    expect(mockYoutubeJsonService.setVideosFromRawContent).toHaveBeenCalledWith(
      '{"items":[]}',
    );
  });
});
