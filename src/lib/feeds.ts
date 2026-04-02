import { getCollection, type CollectionEntry } from 'astro:content';
import MarkdownIt from 'markdown-it';
import { stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { site } from './site';

type Post = CollectionEntry<'posts'>;

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const AUDIO_MIME_TYPES: Record<string, string> = {
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav'
};

export async function getPublishedPosts() {
  return (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

export function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function wrapCdata(value: string) {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

function absolutizeSiteUrls(html: string) {
  return html.replace(
    /\b(href|src|poster)=["'](\/[^"']*)["']/g,
    (_match, attribute: string, value: string) =>
      `${attribute}="${new URL(value, site.url).toString()}"`
  );
}

export function renderPostFeedContent(post: Post) {
  const audioBlock = post.data.audio
    ? `<p><strong>${xmlEscape(post.data.audio.title ?? 'Listen to this article')}:</strong> <a href="${new URL(
        post.data.audio.src,
        site.url
      )}">${new URL(post.data.audio.src, site.url)}</a></p>`
    : '';

  return `${audioBlock}${absolutizeSiteUrls(markdown.render(post.body))}`;
}

export async function getAudioMetadata(src: string) {
  const audioUrl = new URL(src, site.url).toString();
  const extension = extname(src).toLowerCase();
  const type = AUDIO_MIME_TYPES[extension] ?? 'audio/mpeg';

  if (!src.startsWith('/')) {
    return { audioUrl, type, length: undefined as number | undefined };
  }

  try {
    const file = await stat(join(process.cwd(), 'public', src.replace(/^\//, '')));
    return { audioUrl, type, length: file.size };
  } catch {
    return { audioUrl, type, length: undefined as number | undefined };
  }
}
