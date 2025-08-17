import type { Course } from '@/lib/types';

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
  },
  {
    id: '6-sinif-fen',
    title: '6. Sınıf Fen Bilimleri',
    description: 'Maddenin tanecikli yapısından canlılar dünyasına kadar temel fen bilimleri konuları.',
    category: '6. Sınıf',
    imageUrl: 'https://placehold.co/600x400.png',
    sections: [
      {
        id: 's1-fen',
        title: 'Güneş Sistemi ve Tutulmalar',
        lessons: [
          { id: 'l1-1-fen', title: 'Gezegenler', duration: 30 },
          { id: 'l1-2-fen', title: 'Ay ve Güneş Tutulmaları', duration: 25 },
        ],
      },
    ],
  },
  {
    id: '7-sinif-turkce',
    title: '7. Sınıf Türkçe',
    description: 'Dil bilgisi, paragraf anlama ve sözcükte anlam konularını pekiştirin.',
    category: '7. Sınıf',
    imageUrl: 'https://placehold.co/600x400.png',
    sections: [
      {
        id: 's1-turkce',
        title: 'Anlam Bilgisi',
        lessons: [
          { id: 'l1-1-turkce', title: 'Paragrafta Anlam', duration: 25 },
          { id: 'l1-2-turkce', title: 'Sözcükte Anlam', duration: 20 },
        ],
      },
    ],
  },
   {
    id: 'lgs-matematik-hazirlik',
    title: 'LGS Matematik Hazırlık',
    description: 'LGS sınavına yönelik yeni nesil matematik soruları ve konu anlatımları.',
    category: 'LGS',
    imageUrl: 'https://placehold.co/600x400.png',
    sections: [
      {
        id: 's1-lgs',
        title: 'Üslü İfadeler ve Kareköklü İfadeler',
        lessons: [
          { id: 'l1-1-lgs', title: 'Üslü İfadeler', duration: 45 },
          { id: 'l1-2-lgs', title: 'Kareköklü İfadeler', duration: 50 },
          { id: 'l1-3-lgs', title: 'Yeni Nesil Soru Çözümleri', duration: 60 },
        ],
      },
    ],
  },
];
