// ================================================================
// 站点全局配置 + 课程元信息
// ⚠️  上线前把 github.owner / github.repo / giscus 改成你自己的
// ================================================================

export const SITE = {
  name: 'MathNest',
  tagline: 'A cosy home for maths notes',
  description:
    'Free notes, video walkthroughs and worked examples for KS3, IGCSE, A-Level, AP, university maths and 中国初中数学.',
  github: {
    owner: 'pennyzhaozhao',   // ← 改成你的 GitHub 用户名
    repo: 'mathnest',         // ← 改成你的仓库名
    branch: 'main',
  },
  // ⚠️ 部署 Twikoo 到 Cloudflare Workers 后填入你的 Worker URL
  // 部署教程见 components/Comments.tsx 顶部注释
  twikoo: {
    envId: 'REPLACE_ME',   // e.g. 'https://twikoo.yourname.workers.dev'
  },
};

export type ColorKey = 'coral' | 'mint' | 'lemon' | 'lilac' | 'sky' | 'pink';

export type CourseConfig = {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  color: ColorKey;
  description: string;
};

export const COURSES: CourseConfig[] = [
  {
    slug: 'a-level',
    title: 'A-Level Maths',
    subtitle: 'Pre-University · UK',
    icon: '∫',
    color: 'coral',
    description: 'Pure, Mechanics and Statistics — written alongside Edexcel and AQA specs.',
  },
  {
    slug: 'igcse',
    title: 'IGCSE Maths',
    subtitle: 'Secondary · International',
    icon: 'x²',
    color: 'mint',
    description: 'Cambridge & Edexcel IGCSE — core and extended, topic by topic.',
  },
  {
    slug: 'ap',
    title: 'AP Calculus & Stats',
    subtitle: 'College Board',
    icon: 'd/dx',
    color: 'lemon',
    description: 'AP Calc AB/BC and AP Statistics — FRQs, MCQs and the intuition behind them.',
  },
  {
    slug: 'ks3-gcse',
    title: 'KS3 & GCSE Foundation',
    subtitle: 'Secondary · UK',
    icon: '√',
    color: 'lilac',
    description: 'Plain-English explanations, friendly visuals, small wins that build confidence.',
  },
  {
    slug: 'zhongguo-chuzhong',
    title: '初中数学',
    subtitle: '中国初中 · 七至九年级',
    icon: '中',
    color: 'sky',
    description: '人教版与北师大版双线索整理，章节笔记与典型例题逐步上线。',
  },
  {
    slug: 'university',
    title: 'University Foundations',
    subtitle: 'University · Year 1',
    icon: 'Σ',
    color: 'pink',
    description: 'Calculus, Linear Algebra, Probability — bridging A-Level into your first uni term.',
  },
];

export function getCourseConfig(slug: string): CourseConfig | null {
  return COURSES.find((c) => c.slug === slug) ?? null;
}

// 课程颜色 → CSS class（用于 Tailwind 外的内联样式和 data-color）
export const COLOR_VARS: Record<ColorKey, { bg: string; card: string; shadow: string }> = {
  coral:  { bg: 'linear-gradient(160deg,#FFD8C2,#FFB89A)', card: 'linear-gradient(135deg,#FF7A66,#E85A45)', shadow: 'rgba(232,90,69,.22)'  },
  mint:   { bg: 'linear-gradient(160deg,#C7F0DD,#9CDCBE)', card: 'linear-gradient(135deg,#7FD8B0,#3FBF8A)', shadow: 'rgba(63,191,138,.22)'  },
  lemon:  { bg: 'linear-gradient(160deg,#FFE9A8,#FFD06B)', card: 'linear-gradient(135deg,#FFD66B,#F5B82E)', shadow: 'rgba(245,184,46,.22)'  },
  lilac:  { bg: 'linear-gradient(160deg,#DBCDFF,#B9A2F5)', card: 'linear-gradient(135deg,#B9A6F0,#7E68D6)', shadow: 'rgba(126,104,214,.22)' },
  sky:    { bg: 'linear-gradient(160deg,#C6E9FF,#8FCDF7)', card: 'linear-gradient(135deg,#9FD8FF,#3FA9F5)', shadow: 'rgba(63,169,245,.22)'  },
  pink:   { bg: 'linear-gradient(160deg,#FFD6E2,#FFA9C0)', card: 'linear-gradient(135deg,#FFB3C8,#F47FA0)', shadow: 'rgba(255,150,180,.25)' },
};
