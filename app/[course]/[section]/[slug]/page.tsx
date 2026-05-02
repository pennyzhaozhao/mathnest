import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllNotePaths, getNote } from '@/lib/notes';
import { markdownToHtml } from '@/lib/markdown';
import { getCourseConfig } from '@/lib/config';
import LangToggle from '@/components/LangToggle';
import Comments from '@/components/Comments';
import type { Lang } from '@/lib/notes';
import type { Metadata } from 'next';

// 静态导出：为每篇笔记生成页面
// 注意：?lang=zh 不会生成独立 HTML 页面（静态导出的限制），
// 语言切换通过 client-side re-render 实现：
// 服务端预渲染 EN 版本，客户端读 ?lang 参数后 JS 请求 ZH 内容。
// 对于完全静态站来说，下面这个实现是最佳平衡：
//   - 首次加载：SSG 的英文版，SEO 友好
//   - 切换中文：客户端 fetch raw GitHub 内容重新渲染

export function generateStaticParams() {
  return getAllNotePaths();
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const note = getNote(params.course, params.section, params.slug, 'en');
  return { title: note?.title ?? params.slug };
}

export default async function NotePage({ params }: { params: { course: string; section: string; slug: string } }) {
  const { course, section, slug } = params;

  // 服务端：总是渲染英文版（SEO/SSG）；语言切换在客户端做
  const note = getNote(course, section, slug, 'en');
  if (!note) notFound();

  const courseConfig = getCourseConfig(course);
  const html = await markdownToHtml(note.content, course, section);

  return (
    <div className="page-content">
      {/* breadcrumb */}
      <div className="breadcrumb">
        <Link href="/courses">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${course}`}>{courseConfig?.title ?? course}</Link>
        <span>/</span>
        <Link href={`/courses/${course}#${section}`}>{section.replace(/-/g, ' ')}</Link>
        <span>/</span>
        <span>{note.title}</span>
      </div>

      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {courseConfig && (
              <span className={`post-tag ${courseConfig.color}`} style={{ fontSize: 12, padding: '4px 11px', borderRadius: 999, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                {courseConfig.title}
              </span>
            )}
            {note.tags.map((t) => (
              <span key={t} className="post-tag default" style={{ fontSize: 12, padding: '4px 11px', borderRadius: 999, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 10 }}>
            {note.title}
          </h1>
          {note.description && (
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', marginBottom: 8 }}>{note.description}</p>
          )}
          <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>{note.date}</p>
        </div>

        {/* lang toggle — only shows if both langs exist */}
        <LangToggle langs={note.langs} current={'en' as Lang} />
      </div>

      {/* video (if frontmatter youtube/bilibili) */}
      {note.youtube && (
        <div className="video-wrap" style={{ marginBottom: 32, borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-out)', position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${note.youtube}`}
            allowFullScreen loading="lazy" title="Video walkthrough"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      )}
      {note.bilibili && !note.youtube && (
        <div className="video-wrap" style={{ marginBottom: 32, borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-out)', position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${note.bilibili}&page=1&high_quality=1`}
            allowFullScreen loading="lazy" title="Video walkthrough"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      )}

      {/* main note content — client component handles lang switching */}
      <NoteContentWrapper
        html={html}
        course={course}
        section={section}
        slug={slug}
        langs={note.langs}
      />

      {/* comments */}
      <Comments />
    </div>
  );
}

// We need a client component to handle lang switching
// Import it from a separate file (Next.js pattern for SSG + client interactivity)
import NoteContentWrapper from '@/components/NoteContentWrapper';
