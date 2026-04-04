import { getPublishedPosts } from '../lib/feeds';
import { site } from '../lib/site';

export async function GET() {
  const posts = await getPublishedPosts();
  const staticPages = [
    {
      path: '/',
      lastModified: posts[0]?.data.updatedDate ?? posts[0]?.data.pubDate
    },
    {
      path: '/posts/',
      lastModified: posts[0]?.data.updatedDate ?? posts[0]?.data.pubDate
    },
    {
      path: '/rss.xml'
    },
    {
      path: '/audio.xml'
    },
    {
      path: '/llms.txt'
    }
  ];

  const urls = [
    ...staticPages.map((page) => ({
      loc: new URL(page.path, site.url).toString(),
      lastModified: page.lastModified
    })),
    ...posts.map((post) => ({
      loc: new URL(`/posts/${post.slug}/`, site.url).toString(),
      lastModified: post.data.updatedDate ?? post.data.pubDate
    }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) => `  <url>\n    <loc>${url.loc}</loc>${
        url.lastModified ? `\n    <lastmod>${url.lastModified.toISOString()}</lastmod>` : ''
      }\n  </url>`
    )
    .join('\n')}\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
