export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  sections: Section[];
}

export interface UserProgress {
  [courseId: string]: {
    completedLessons: string[];
  };
}

export type EmbedType = 'youtube' | 'drive' | 'iframe';

export interface EmbeddableContent {
  id: string;
  title: string;
  type: EmbedType;
  url: string;
  embedUrl: string;
}
