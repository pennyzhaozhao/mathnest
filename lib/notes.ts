// ================================================================
// 核心：扫描 content/courses/、解析双语笔记、自动按 course/section 归类
//
// 文件命名约定：
//   content/courses/{course}/{section}/{slug}.en.md  ← 英文版
//   content/courses/{course}/{section}/{slug}.zh.md  ← 中文版（可选）
//
// frontmatter 示例：
//   ---
//   title: Quadratic Equations
//   description: Three methods for solving ax²+bx+c=0
//   date: 2026-05-01
//   tags: [algebra, quadratics]
//   youtube: dQw4w9WgXcQ        # YouTube 视频 ID（可选）
//   bilibili: BV1GJ411x7h7      # Bilibili BV 号（可选）
//   ---
// ================================================================

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type Lang = 'en' | 'zh';

export type Note = {
  slug: string;       // 基础 slug（去掉 .en/.zh 后缀和 .md）
  course: string;     // 课程 slug（来自目录名）
  section: string;    // 章节 slug（来自目录名）
  langs: Lang[];      // 这篇笔记有哪些语言版本
  // 以下字段来自对应语言的 frontmatter
  title: string;
  description: string;
  date: string;
  tags: string[];
  youtube?: string;
  bilibili?: string;
  // 原始 markdown 内容（根据请求的语言选择）
  content: string;
};

export type NoteIndex = {
  // 不含 content，用于列表页（避免把所有文章内容载入内存）
  slug: string;
  course: string;
  section: string;
  langs: Lang[];
  title: string;
  description: string;
  date: string;
  tags: string[];
  youtube?: string;
  bilibili?: string;
};

export type SectionGroup = {
  slug: string;
  title: string;
  notes: NoteIndex[];
};

export type CourseTree = {
  slug: string;
  sections: SectionGroup[];
  totalNotes: number;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'courses');

function slugToTitle(slug: string): string {
  // 中文 slug 直接返回
  if (/[\u4e00-\u9fa5]/.test(slug)) return slug;
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// 扫描所有笔记，返回 NoteIndex[]（不含 content）
export function getAllNoteIndex(): NoteIndex[] {
  const index: NoteIndex[] = [];
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const courses = fs.readdirSync(CONTENT_DIR);

  for (const course of courses) {
    const coursePath = path.join(CONTENT_DIR, course);
    if (!fs.statSync(coursePath).isDirectory()) continue;

    const sections = fs.readdirSync(coursePath);

    for (const section of sections) {
      const sectionPath = path.join(coursePath, section);
      if (!fs.statSync(sectionPath).isDirectory()) continue;

      const files = fs.readdirSync(sectionPath);

      // 把同一 slug 的 .en.md / .zh.md 归为一组
      const slugMap: Record<string, Lang[]> = {};
      for (const f of files) {
        const m = f.match(/^(.+)\.(en|zh)\.md$/);
        if (!m) continue;
        const [, baseSlug, lang] = m;
        if (!slugMap[baseSlug]) slugMap[baseSlug] = [];
        slugMap[baseSlug].push(lang as Lang);
      }

      for (const [baseSlug, langs] of Object.entries(slugMap)) {
        try {
          const preferLang = langs.includes('en') ? 'en' : langs[0];
          const filePath = path.join(sectionPath, `${baseSlug}.${preferLang}.md`);
          const { data } = matter(fs.readFileSync(filePath, 'utf-8'));

          index.push({
            slug: baseSlug,
            course,
            section,
            langs,
            title: data.title || slugToTitle(baseSlug),
            description: data.description || '',
            date: data.date ? String(data.date).slice(0, 10) : '2026-01-01',
            tags: Array.isArray(data.tags) ? data.tags : [],
            youtube: data.youtube,
            bilibili: data.bilibili,
          });
        } catch (e) {
          console.warn(`[notes] skipped ${course}/${section}/${baseSlug}:`, e);
        }
      }
    }
  }

  index.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return index;
}

// 读取单篇笔记的指定语言版本（fallback 到另一种语言）
export function getNote(
  course: string,
  section: string,
  slug: string,
  lang: Lang = 'en'
): Note | null {
  const sectionPath = path.join(CONTENT_DIR, course, section);

  // 尝试请求的语言，没有就 fallback
  const tryLangs: Lang[] = lang === 'zh' ? ['zh', 'en'] : ['en', 'zh'];
  let chosenLang: Lang | null = null;
  let filePath = '';

  for (const l of tryLangs) {
    const fp = path.join(sectionPath, `${slug}.${l}.md`);
    if (fs.existsSync(fp)) { chosenLang = l; filePath = fp; break; }
  }
  if (!chosenLang) return null;

  const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'));

  // 收集该 slug 有哪些语言版本
  const langs: Lang[] = (['en', 'zh'] as Lang[]).filter((l) =>
    fs.existsSync(path.join(sectionPath, `${slug}.${l}.md`))
  );

  return {
    slug,
    course,
    section,
    langs,
    title: data.title || slugToTitle(slug),
    description: data.description || '',
    date: data.date ? String(data.date).slice(0, 10) : '2026-01-01',
    tags: Array.isArray(data.tags) ? data.tags : [],
    youtube: data.youtube,
    bilibili: data.bilibili,
    content,
  };
}

// 按 course 聚合所有笔记（用于课程目录页）
export function getCourseTree(courseSlug: string): CourseTree {
  const notes = getAllNoteIndex().filter((n) => n.course === courseSlug);

  const sectionMap: Record<string, NoteIndex[]> = {};
  for (const note of notes) {
    if (!sectionMap[note.section]) sectionMap[note.section] = [];
    sectionMap[note.section].push(note);
  }

  const sections: SectionGroup[] = Object.entries(sectionMap).map(([slug, notes]) => ({
    slug,
    title: slugToTitle(slug),
    notes,
  }));

  return { slug: courseSlug, sections, totalNotes: notes.length };
}

// 用于 getStaticPaths：返回所有 [course, section, slug] 组合
export function getAllNotePaths(): { course: string; section: string; slug: string }[] {
  return getAllNoteIndex().map(({ course, section, slug }) => ({ course, section, slug }));
}

// 最新 N 篇笔记（用于首页）
export function getRecentNotes(n = 6): NoteIndex[] {
  return getAllNoteIndex().slice(0, n);
}

// 按 tag 过滤
export function getNotesByTag(tag: string): NoteIndex[] {
  return getAllNoteIndex().filter((n) => n.tags.includes(tag));
}
