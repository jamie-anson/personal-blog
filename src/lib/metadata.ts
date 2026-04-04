import { site } from './site';

type StructuredDataValue = Record<string, unknown> | Array<Record<string, unknown>>;

export function toAbsoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return undefined;

  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(pathOrUrl, site.url).toString();
  }
}

export function stringifyStructuredData(value: StructuredDataValue) {
  return JSON.stringify(value, null, 2);
}

export function buildSiteStructuredData() {
  const websiteId = `${site.url}/#website`;
  const personId = `${site.url}/#author`;
  const organizationId = `${site.url}/#organization`;

  return [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': websiteId,
          url: site.url,
          name: site.title,
          description: site.description,
          publisher: { '@id': organizationId },
          inLanguage: 'en-GB'
        },
        {
          '@type': 'Organization',
          '@id': organizationId,
          name: site.publisher.name,
          url: site.publisher.url,
          logo: site.publisher.logo,
          sameAs: site.sameAs
        },
        {
          '@type': 'Person',
          '@id': personId,
          name: site.author.name,
          url: site.author.url,
          sameAs: site.sameAs
        }
      ]
    }
  ];
}

type ArticleMetadataOptions = {
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
}: ArticleMetadataOptions) {
  const websiteId = `${site.url}/#website`;
  const personId = `${site.url}/#author`;
  const organizationId = `${site.url}/#organization`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: canonicalUrl,
    headline: title,
    description,
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime,
    author: {
      '@id': personId
    },
    publisher: {
      '@id': organizationId
    },
    isPartOf: {
      '@id': websiteId
    },
    inLanguage: 'en-GB',
    articleSection: category,
    keywords: [...tags, ...keywords].join(', ') || undefined,
    image: image ? [image] : undefined
  };
}
