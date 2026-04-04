import { site } from './site';

type ArticleStructuredDataInput = {
  title: string;
  description: string;
  canonicalUrl: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  tags?: string[];
  keywords?: string[];
  category?: string;
};

export function toAbsoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) {
    return undefined;
  }

  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(pathOrUrl, site.url).toString();
  }
}

export function buildArticleStructuredData({
  title,
  description,
  canonicalUrl,
  publishedTime,
  modifiedTime,
  image,
  tags = [],
  keywords = [],
  category
}: ArticleStructuredDataInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime,
    image,
    keywords: [...tags, ...keywords].join(', ') || undefined,
    articleSection: category,
    author: {
      '@type': 'Person',
      name: 'Jamie Anson'
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: site.url
    }
  };
}
