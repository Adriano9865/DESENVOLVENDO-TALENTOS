export interface LibraryMaterial {
  id: number;
  title: string;
  type: 'PDF' | 'Vídeo' | 'Link';
  url: string;
  courseId: number;
}
