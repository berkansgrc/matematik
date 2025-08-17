import type { Course } from '@/lib/types';

export const courses: Course[] = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Learn the basics of React and build your first modern web application.',
    category: 'Web Development',
    imageUrl: 'https://placehold.co/600x400.png',
    sections: [
      {
        id: 's1',
        title: 'Introduction to React',
        lessons: [
          { id: 'l1-1', title: 'What is React?', duration: 10 },
          { id: 'l1-2', title: 'Setting up your environment', duration: 15 },
          { id: 'l1-3', title: 'JSX Explained', duration: 12 },
        ],
      },
      {
        id: 's2',
        title: 'Components and Props',
        lessons: [
          { id: 'l2-1', title: 'Functional Components', duration: 20 },
          { id: 'l2-2', title: 'Passing Props', duration: 18 },
          { id: 'l2-3', title: 'Composing Components', duration: 22 },
        ],
      },
      {
        id: 's3',
        title: 'State and Lifecycle',
        lessons: [
          { id: 'l3-1', title: 'Introduction to State', duration: 15 },
          { id: 'l3-2', title: 'The useState Hook', duration: 25 },
          { id: 'l3-3', title: 'The useEffect Hook', duration: 30 },
        ],
      },
    ],
  },
  {
    id: 'advanced-css',
    title: 'Advanced CSS and Sass',
    description: 'Master modern CSS techniques, including Flexbox, Grid, and animations. Preprocess with Sass.',
    category: 'Web Design',
    imageUrl: 'https://placehold.co/600x400.png',
    sections: [
      {
        id: 's1-css',
        title: 'Modern Layouts',
        lessons: [
          { id: 'l1-1-css', title: 'Flexbox Deep Dive', duration: 30 },
          { id: 'l1-2-css', title: 'CSS Grid Essentials', duration: 45 },
        ],
      },
      {
        id: 's2-css',
        title: 'Sass Preprocessing',
        lessons: [
          { id: 'l2-1-css', title: 'Variables and Nesting', duration: 20 },
          { id: 'l2-2-css', title: 'Mixins and Functions', duration: 25 },
        ],
      },
    ],
  },
  {
    id: 'javascript-es6',
    title: 'JavaScript: The New Parts',
    description: 'Explore the modern features of JavaScript including ES6+ syntax and concepts.',
    category: 'Web Development',
    imageUrl: 'https://placehold.co/600x400.png',
    sections: [
      {
        id: 's1-js',
        title: 'Syntax Improvements',
        lessons: [
          { id: 'l1-1-js', title: 'Arrow Functions', duration: 15 },
          { id: 'l1-2-js', title: 'let and const', duration: 10 },
          { id: 'l1-3-js', title: 'Template Literals', duration: 8 },
        ],
      },
      {
        id: 's2-js',
        title: 'Asynchronous JavaScript',
        lessons: [
          { id: 'l2-1-js', title: 'Promises', duration: 25 },
          { id: 'l2-2-js', title: 'Async/Await', duration: 30 },
        ],
      },
    ],
  },
   {
    id: 'ui-design-principles',
    title: 'UI Design Principles',
    description: 'Learn the fundamental principles of creating beautiful and user-friendly interfaces.',
    category: 'Design',
    imageUrl: 'https://placehold.co/600x400.png',
    sections: [
      {
        id: 's1-ui',
        title: 'Core Concepts',
        lessons: [
          { id: 'l1-1-ui', title: 'Color Theory', duration: 20 },
          { id: 'l1-2-ui', title: 'Typography', duration: 25 },
          { id: 'l1-3-ui', title: 'Layout and Composition', duration: 30 },
        ],
      },
    ],
  },
];
