import { getCollection } from 'astro:content';
import { site } from '../lib/site';

export async function GET() {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const items = posts
    .map((post) => {
      const url = `${site.url}/posts/${post.slug}/`;

      return `
        <item>
          <title><![CDATA[${post.data.title}]]></title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
          <description><![CDATA[${post.data.description}]]></description>
        </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${site.title}</title>
        <description>${site.description}</description>
        <link>${site.url}</link>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}
