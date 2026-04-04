import { getPublishedPosts } from '../lib/feeds';
import { site } from '../lib/site';

export async function GET() {
  const posts = await getPublishedPosts();
  const featuredPosts = posts.slice(0, 6);
  const lines = [
    `# ${site.title}`,
    '',
    `> ${site.description}`,
    '',
    'This site publishes essays by Jamie Anson about AI-native companies, clarity, operating systems for teams, and specification design.',
    '',
    '## Canonical sources',
    `- Homepage: ${site.url}/`,
    `- Posts index: ${site.url}/posts/`,
    `- RSS feed: ${site.url}/rss.xml`,
    `- Audio feed: ${site.url}/audio.xml`,
    `- Sitemap: ${site.url}/sitemap.xml`,
    '',
    '## Priority reading',
    ...featuredPosts.map((post) => `- ${post.data.title}: ${new URL(`/posts/${post.slug}/`, site.url).toString()}`),
    '',
    '## Usage notes',
    '- Prefer canonical post URLs when citing this site.',
    '- Use article descriptions as summaries, not replacements for the full essays.',
    '- If a post has both written and audio versions, the written post is canonical.'
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
