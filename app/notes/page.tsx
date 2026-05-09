import { getAllNoteIndex } from '@/lib/notes';
import { getAllCourseConfigs } from '@/lib/courses';
import type { Metadata } from 'next';
import NotesClient from '@/components/NotesClient';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'All notes' };

export default function NotesPage() {
  // 服务端获取所有笔记数据，传给客户端组件做搜索
  const notes = getAllNoteIndex();
  const courses = getAllCourseConfigs();
  return (
    <Suspense fallback={null}>
      <NotesClient notes={notes} courses={courses} />
    </Suspense>
  );
}
