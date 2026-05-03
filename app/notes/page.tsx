import { getAllNoteIndex } from '@/lib/notes';
import { COURSES } from '@/lib/config';
import type { Metadata } from 'next';
import NotesClient from '@/components/NotesClient';

export const metadata: Metadata = { title: 'All notes' };

export default function NotesPage() {
  // 服务端获取所有笔记数据，传给客户端组件做搜索
  const notes = getAllNoteIndex();
  return <NotesClient notes={notes} courses={COURSES} />;
}
