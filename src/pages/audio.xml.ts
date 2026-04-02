import { getAudioMetadata, getPublishedPosts, xmlEscape } from '../lib/feeds';
import { site } from '../lib/site';

export async function GET() {
  const posts = (await getPublishedPosts()).filter((post) => post.data.audio);
  const feedUrl = `${site.url}/audio.xml`;
  const latestDate = posts[0]?.data.updatedDate ?? posts[0]?.data.pubDate ?? new Date();

  const items = await Promise.all(
    posts.map(async (post) => {
      const audio = post.data.audio;

      if (!audio) {
        return '';
      }

      const postUrl = `${site.url}/posts/${post.slug}/`;
      const { audioUrl, length, type } = await getAudioMetadata(audio.src);
      const title = xmlEscape(audio.title ?? `${post.data.title} (Audio)`);
      const description = xmlEscape(post.data.description);

      return `
        <item>
          <title>${title}</title>
          <link>${postUrl}</link>
          <guid isPermaLink="false">${audioUrl}</guid>
          <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
          <description>${description}</description>
          <enclosure url="${audioUrl}"${length ? ` length="${length}"` : ''} type="${type}" />
        </item>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${xmlEscape(`${site.title} Audio`)}</title>
        <description>${xmlEscape(`Audio versions of selected essays from ${site.title}.`)}</description>
        <link>${site.url}</link>
        <language>en-gb</language>
        <lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>
        <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
        ${items.join('')}
      </channel>
    </rss>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}
