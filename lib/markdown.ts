// ================================================================
// Markdown → HTML 管线
// 支持：KaTeX 数学公式、代码语法高亮、YouTube/Bilibili 自动嵌入、
//        GitHub raw 图片链接、GitHub 风格 callout (> [!NOTE] 等)
// ================================================================

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { SITE } from './config';
import { applyCallouts, normalizeLooseCallouts } from './callouts';

// 把 markdown 中的相对图片路径转成 GitHub raw URL
// 这样图片不用存在 Next.js public/，而是放在 content/ 旁边
function githubImagePlugin(course: string, section: string) {
  return () => (tree: any) => {
    visit(tree, 'image', (node: any) => {
      const src: string = node.url;
      if (src.startsWith('http') || src.startsWith('/')) return;
      // 相对路径：./my-image.png → GitHub raw URL
      const { owner, repo, branch } = SITE.github;
      node.url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/content/courses/${course}/${section}/${src.replace(/^\.\//, '')}`;
    });
  };
}

// 把 YouTube / Bilibili 链接段落替换成 <iframe>
// 支持：
//   https://www.youtube.com/watch?v=VIDEO_ID
//   https://youtu.be/VIDEO_ID
//   https://www.bilibili.com/video/BV...
function videoEmbedPlugin() {
  return () => (tree: any) => {
    visit(tree, 'paragraph', (node: any, index: number, parent: any) => {
      if (node.children.length !== 1 || node.children[0].type !== 'link') return;
      const href: string = node.children[0].url;

      let iframe = '';

      // YouTube
      const ytMatch =
        href.match(/youtube\.com\/watch\?v=([\w-]+)/) ||
        href.match(/youtu\.be\/([\w-]+)/);
      if (ytMatch) {
        iframe = `<div class="video-wrap"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" allowfullscreen loading="lazy" title="YouTube video"></iframe></div>`;
      }

      // Bilibili
      const biliMatch = href.match(/bilibili\.com\/video\/(BV[\w]+)/);
      if (biliMatch) {
        iframe = `<div class="video-wrap"><iframe src="https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&page=1&high_quality=1" allowfullscreen loading="lazy" title="Bilibili video"></iframe></div>`;
      }

      if (iframe && parent) {
        parent.children[index] = { type: 'html', value: iframe };
      }
    });
  };
}

export async function markdownToHtml(
  content: string,
  course: string,
  section: string
): Promise<string> {
  const result = await unified()
    .use(remarkParse as any)
    .use(remarkGfm)
    .use(remarkMath)
    .use(videoEmbedPlugin())
    .use(githubImagePlugin(course, section))
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(normalizeLooseCallouts(content));

  return applyCallouts(String(result));
}
