import { courses } from '@/lib/data';
import type { Course } from '@/lib/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Book, Clock } from 'lucide-react';
import CourseProgress from './course-progress';

async function getCourse(id: string): Promise<Course | undefined> {
  return courses.find((course) => course.id === id);
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const totalDuration = course.sections.reduce((acc, section) => {
    return acc + section.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.duration, 0);
  }, 0);

  return (
    <div className="container max-w-5xl mx-auto py-8">
       <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                    data-ai-hint="e-learning concept"
                />
            </div>
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                    <Book className="h-4 w-4" />
                    <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Approx. {Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
            </div>
            <p className="text-lg text-muted-foreground">{course.description}</p>
        </div>
        <div className="md:col-span-1">
            <CourseProgress course={course} />
        </div>
      </div>
    </div>
  );
}

// Generate static paths for all courses
export async function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }));
}
