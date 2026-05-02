// 仅用于本地开发：读取磁盘上的 .zh.md 文件内容返回给客户端
// 生产环境（Cloudflare Pages）不会用到这个 route，
// 因为 next.config.js 用 output: 'export' 静态导出，API routes 不会被导出
// 但本地 `npm run dev` 时 API routes 正常工作

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const course  = searchParams.get('course')  || '';
  const section = searchParams.get('section') || '';
  const slug    = searchParams.get('slug')    || '';
  const lang    = searchParams.get('lang')    || 'zh';

  // 安全：只允许字母、数字、连字符
  const safe = (s: string) => /^[\w-]+$/.test(s);
  if (!safe(course) || !safe(section) || !safe(slug) || !['en','zh'].includes(lang)) {
    return NextResponse.json({ error: 'invalid params' }, { status: 400 });
  }

  const filePath = path.join(
    process.cwd(), 'content', 'courses', course, section, `${slug}.${lang}.md`
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(raw); // 去掉 frontmatter，只返回 body

  return NextResponse.json({ content });
}
