import fs from 'fs';
import path from 'path';
import { COURSES, type CourseConfig } from '@/lib/config';

function getExtraCoursesPath(): string {
  return path.resolve(__dirname, '..', 'content', 'courses-extra.json');
}

function readExtraCourses(): CourseConfig[] {
  const filePath = getExtraCoursesPath();
  if (!fs.existsSync(filePath)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((course): course is CourseConfig =>
      course &&
      typeof course.slug === 'string' &&
      typeof course.title === 'string' &&
      typeof course.subtitle === 'string' &&
      typeof course.icon === 'string' &&
      typeof course.color === 'string' &&
      typeof course.description === 'string'
    );
  } catch (error) {
    console.warn('[courses] failed to read content/courses-extra.json:', error);
    return [];
  }
}

export function getAllCourseConfigs(): CourseConfig[] {
  const base = COURSES.map((course) => ({ ...course }));
  const extras = readExtraCourses();
  const baseSlugs = new Set(base.map((course) => course.slug));
  const overrides = new Map(extras.map((course) => [course.slug, course]));
  return [
    ...base.map((course) => overrides.get(course.slug) ?? course),
    ...extras.filter((course) => !baseSlugs.has(course.slug)),
  ];
}

export function getMergedCourseConfig(slug: string): CourseConfig | null {
  return getAllCourseConfigs().find((course) => course.slug === slug) ?? null;
}
