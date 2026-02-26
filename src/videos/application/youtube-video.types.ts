export interface YoutubeVideoListResponseRaw {
  kind: string;
  items: YoutubeVideoItemRaw[];
}

export interface YoutubeVideoItemRaw {
  id: string;
  snippet?: YoutubeVideoSnippetRaw;
  statistics?: YoutubeVideoStatisticsRaw;
}

export interface YoutubeVideoSnippetRaw {
  title?: string;
  channelTitle?: string;
  publishedAt?: string;
  thumbnails?: {
    high?: {
      url?: string;
    };
  };
}

export interface YoutubeVideoStatisticsRaw {
  viewCount?: string;
  likeCount?: string;
  commentCount?: string | null;
}
