// ================================================================
// 练习题系统
//
// 文件格式：content/practice/{course}/{slug}.md
//
// frontmatter：
//   title, course, section, difficulty, tags, related_note (可选)
//
// 题目用特殊标记分隔，每道题之间用空行隔开：
//
// [[MCQ]]                    ← 选择题
// question: 题干（支持 LaTeX）
// A: 选项A
// B: 选项B ✓               ← ✓ 标记正确答案
// C: 选项C
// D: 选项D
// explanation: 解析（可选）
//
// [[FILL]]                   ← 填空题
// question: 题干
// answer: 9                  ← 标准答案（字符串匹配）
// tolerance: 0               ← 数字题误差（0=精确）
// explanation: 解析（可选）
//
// [[SHORT]]                  ← 简答题
// question: 题干
// marks: 3
// answer: |                  ← model answer，多行
//   步骤一...
//   步骤二...
// ================================================================

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type Difficulty = 'foundation' | 'standard' | 'challenge';

export type MCQ = {
  type: 'mcq';
  id: string;
  question: string;
  options: { label: string; text: string; correct: boolean }[];
  explanation?: string;
};

export type Fill = {
  type: 'fill';
  id: string;
  question: string;
  answer: string;
  tolerance: number;
  explanation?: string;
};

export type Short = {
  type: 'short';
  id: string;
  question: string;
  marks: number;
  answer: string;
  explanation?: string;
};

export type Question = MCQ | Fill | Short;

export type PracticeSet = {
  slug: string;
  course: string;
  section: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  relatedNote?: string;   // slug of related note
  questions: Question[];
};

export type PracticeIndex = Omit<PracticeSet, 'questions'> & { questionCount: number };

const PRACTICE_DIR = path.join(process.cwd(), 'content', 'practice');

// 解析单个题目块
function parseBlock(raw: string, idx: number): Question | null {
  const lines = raw.trim().split('\n');
  const typeLine = lines[0].trim();

  if (typeLine === '[[MCQ]]') {
    let question = '';
    const options: MCQ['options'] = [];
    let explanation = '';

    for (const line of lines.slice(1)) {
      const m = line.match(/^([A-D]):\s*(.+)$/);
      if (m) {
        const correct = m[2].includes('✓');
        options.push({ label: m[1], text: m[2].replace('✓', '').trim(), correct });
        continue;
      }
      if (line.startsWith('question:')) { question = line.replace('question:', '').trim(); continue; }
      if (line.startsWith('explanation:')) { explanation = line.replace('explanation:', '').trim(); continue; }
    }
    if (!question || options.length === 0) return null;
    return { type: 'mcq', id: `q${idx}`, question, options, explanation };
  }

  if (typeLine === '[[FILL]]') {
    let question = '', answer = '', explanation = '';
    let tolerance = 0;

    for (const line of lines.slice(1)) {
      if (line.startsWith('question:')) { question = line.replace('question:', '').trim(); continue; }
      if (line.startsWith('answer:'))   { answer   = line.replace('answer:', '').trim();   continue; }
      if (line.startsWith('tolerance:')){ tolerance = parseFloat(line.replace('tolerance:', '').trim()) || 0; continue; }
      if (line.startsWith('explanation:')) { explanation = line.replace('explanation:', '').trim(); continue; }
    }
    if (!question || !answer) return null;
    return { type: 'fill', id: `q${idx}`, question, answer, tolerance, explanation };
  }

  if (typeLine === '[[SHORT]]') {
    let question = '', marks = 1, explanation = '';
    const answerLines: string[] = [];
    let inAnswer = false;

    for (const line of lines.slice(1)) {
      if (line.startsWith('question:')) { question = line.replace('question:', '').trim(); continue; }
      if (line.startsWith('marks:'))    { marks = parseInt(line.replace('marks:', '').trim()) || 1; continue; }
      if (line.startsWith('explanation:')) { explanation = line.replace('explanation:', '').trim(); continue; }
      if (line.startsWith('answer:')) { inAnswer = true; continue; }
      if (inAnswer) answerLines.push(line.startsWith('  ') ? line.slice(2) : line);
    }
    if (!question) return null;
    return { type: 'short', id: `q${idx}`, question, marks, answer: answerLines.join('\n').trim(), explanation };
  }

  return null;
}

// 把 markdown body 里的题目块解析出来
function parseQuestions(body: string): Question[] {
  // 用 [[TYPE]] 分割
  const blocks = body.split(/(?=\[\[(?:MCQ|FILL|SHORT)\]\])/);
  const questions: Question[] = [];
  let idx = 0;
  for (const block of blocks) {
    if (!block.trim() || !block.match(/^\[\[/)) continue;
    const q = parseBlock(block, idx++);
    if (q) questions.push(q);
  }
  return questions;
}

// 递归收集目录下所有 .md 文件路径
function collectMdFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      results.push(...collectMdFiles(full));
    } else if (entry.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

// 扫描所有练习题集
export function getAllPracticeIndex(): PracticeIndex[] {
  const result: PracticeIndex[] = [];
  if (!fs.existsSync(PRACTICE_DIR)) return [];

  const allFiles = collectMdFiles(PRACTICE_DIR);

  for (const filePath of allFiles) {
    // 从完整路径提取 course 和 slug
    // PRACTICE_DIR = .../content/practice
    // filePath     = .../content/practice/igcse/quadratics-set1.md
    //             or .../content/practice/igcse/algebra/quadratics-set1.md (兼容)
    const rel = path.relative(PRACTICE_DIR, filePath); // e.g. "igcse/quadratics-set1.md"
    const parts = rel.split(path.sep);
    const course = parts[0];
    const filename = parts[parts.length - 1];
    const slug = filename.replace(/\.md$/, '');

    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      const questions = parseQuestions(content);
      result.push({
        slug,
        course: data.course || course,  // frontmatter 优先，否则用目录名
        section: data.section || '',
        title: data.title || slug,
        difficulty: (data.difficulty || 'standard') as Difficulty,
        tags: Array.isArray(data.tags) ? data.tags : [],
        relatedNote: data.related_note,
        questionCount: questions.length,
      });
    } catch { /* skip malformed files */ }
  }
  return result;
}

// 读取单个练习题集（递归搜索，course 目录下任意层级）
export function getPracticeSet(course: string, slug: string): PracticeSet | null {
  const courseDir = path.join(PRACTICE_DIR, course);
  if (!fs.existsSync(courseDir)) return null;

  // 递归找 {slug}.md
  const allFiles = collectMdFiles(courseDir);
  const filePath = allFiles.find(f => path.basename(f) === `${slug}.md`);
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    course: data.course || course,
    section: data.section || '',
    title: data.title || slug,
    difficulty: (data.difficulty || 'standard') as Difficulty,
    tags: Array.isArray(data.tags) ? data.tags : [],
    relatedNote: data.related_note,
    questions: parseQuestions(content),
  };
}

export function getAllPracticePaths() {
  return getAllPracticeIndex().map(p => ({ course: p.course, slug: p.slug }));
}

export function getPracticeByCourse(course: string): PracticeIndex[] {
  return getAllPracticeIndex().filter(p => p.course === course);
}
