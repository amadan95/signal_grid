import { envConfig } from '../config/env';

interface NewsApiArticle {
  title: string;
  source?: {
    name?: string;
  };
  publishedAt?: string;
}

interface NewsApiResponse {
  status: string;
  articles?: NewsApiArticle[];
  code?: string;
  message?: string;
}

export interface NewsStory {
  title: string;
  source: string;
  publishedAt: string;
}

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

const cleanHeadline = (headline: string) =>
  headline
    .replace(/\s+-\s+[^-]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

export const fetchNewsApiHeadline = async (
  category: 'general' | 'sports',
  seed: number,
): Promise<NewsStory> => {
  if (!envConfig.newsApiKey) {
    throw new Error('NewsAPI key is missing');
  }

  const params = new URLSearchParams({
    country: envConfig.newsApiCountry,
    category,
    pageSize: '5',
    apiKey: envConfig.newsApiKey,
  });

  const response = await fetch(`${NEWS_API_URL}?${params.toString()}`);
  const data = (await response.json()) as NewsApiResponse;

  if (!response.ok || data.status !== 'ok') {
    throw new Error(data.message || `NewsAPI request failed with ${response.status}`);
  }

  const articles = data.articles?.filter((article) => article.title?.trim()) ?? [];

  if (articles.length === 0) {
    throw new Error(`No ${category} headlines available`);
  }

  const article = articles[seed % articles.length];

  return {
    title: cleanHeadline(article.title),
    source: article.source?.name?.trim() || 'NEWSAPI',
    publishedAt: article.publishedAt || new Date().toISOString(),
  };
};
