import { getPublishedPosts, renderPostFeedContent, wrapCdata, xmlEscape } from '../lib/feeds';
import { site } from '../lib/site';

export async function GET() {
  const posts = await getPublishedPosts();
  const feedUrl = `${site.url}/rss.xml`;
  const items = posts
    .map((post) => {
      const url = `${site.url}/posts/${post.slug}/`;
      const description = xmlEscape(post.data.description);
      const title = xmlEscape(post.data.title);
      const content = wrapCdata(renderPostFeedContent(post));

      return `
        <item>
          <title>${title}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
          <description>${description}</description>
          <content:encoded>${content}</content:encoded>
        </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
      <channel>
        <title>${xmlEscape(site.title)}</title>
        <description>${xmlEscape(site.description)}</description>
        <link>${site.url}</link>
        <language>en-gb</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
        ${items}
      </channel>
    </rss>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}
