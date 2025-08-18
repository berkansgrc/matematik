import type { Course } from '@/lib/types';

// This file is no longer the primary source of truth for courses.
// It can be used for seeding the database or as a backup.
// Data is now fetched from Firebase Firestore.

export const courses: Course[] = [
  {
    id: '5-sinif-matematik',
    title: '5. Sınıf Matematik',
    description: 'Temel matematik konularını eğlenceli ve anlaşılır bir şekilde öğrenin.',
    category: '5. Sınıf',
    imageUrl: 'https://placehold.co/600x400.png',
    sections: [
      {
        id: 's1',
        title: 'Doğal Sayılar',
        lessons: [
          { id: 'l1-1', title: 'Doğal Sayılarla İşlemler', duration: 20 },
          { id: 'l1-2', title: 'Problem Çözme', duration: 25 },
        ],
      },
      {
        id: 's2',
        title: 'Kesirler',
        lessons: [
          { id: 'l2-1', title: 'Kesir Kavramı', duration: 15 },
          { id: 'l2-2', title: 'Kesirlerle Sıralama', duration: 20 },
        ],
      },
    ],
    content: [
       {
        id: 'yt-1',
        title: 'Örnek YouTube Videosu',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
    ]
  },
];
