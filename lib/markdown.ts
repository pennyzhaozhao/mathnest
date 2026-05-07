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

// ── GitHub 风格 Callout ──────────────────────────────────────
// 语法：> [!NOTE] / [!TIP] / [!IMPORTANT] / [!WARNING] / [!CAUTION]
// callout 后处理：解析 HTML，把 [!TYPE] blockquote 换成 callout div
function applyCallouts(html: string): string {
  const TYPES: Record<string, { icon: string; label: string }> = {
    NOTE:      { icon: 'ℹ️',  label: 'Note'      },
    TIP:       { icon: '💡', label: 'Tip'       },
    IMPORTANT: { icon: '📣', label: 'Important' },
    WARNING:   { icon: '⚠️',  label: 'Warning'   },
    CAUTION:   { icon: '🚫', label: 'Caution'   },
  };

  const result: string[] = [];
  let i = 0;

  while (i < html.length) {
    // 找下一个 <blockquote>
    const bqStart = html.indexOf('<blockquote>', i);
    if (bqStart === -1) { result.push(html.slice(i)); break; }

    // 找对应的 </blockquote>（处理嵌套）
    result.push(html.slice(i, bqStart));
    let depth = 1;
    let j = bqStart + '<blockquote>'.length;
    while (j < html.length && depth > 0) {
      const open  = html.indexOf('<blockquote>', j);
      const close = html.indexOf('</blockquote>', j);
      if (close === -1) break;
      if (open !== -1 && open < close) { depth++; j = open + '<blockquote>'.length; }
      else { depth--; if (depth === 0) break; j = close + '</blockquote>'.length; }
    }
    const bqEnd = j; // points to start of </blockquote>
    const inner = html.slice(bqStart + '<blockquote>'.length, bqEnd);

    // 检查是否是 callout：第一个 <p> 开头有 [!TYPE]
    const firstP = inner.match(/^\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*/i);
    if (firstP) {
      const type = firstP[1].toUpperCase();
      const { icon, label } = TYPES[type];
      // 去掉第一个 <p> 里的 [!TYPE] 标记，其余内容全部保留
      const body = inner.replace(/^\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*/i, '<p>');
      result.push(
        `<div class="callout callout-${type.toLowerCase()}">` +
        `<div class="callout-title"><span class="callout-icon">${icon}</span>${label}</div>` +
        `<div class="callout-body">${body}</div></div>`
      );
    } else {
      result.push(`<blockquote>${inner}</blockquote>`);
    }

    i = bqEnd + '</blockquote>'.length;
  }

  return result.join('');
}

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
    .process(content);

  return applyCallouts(String(result));
}
