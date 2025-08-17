import { courses } from '@/lib/data';
import type { Course } from '@/lib/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Book, Clock, Youtube, FileText, Link as LinkIcon } from 'lucide-react';
import CourseProgress from './course-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';

async function getCourse(id: string): Promise<Course | undefined> {
  return courses.find((course) => course.id === id);
}

const getIcon = (type: string) => {
    switch(type) {
      case 'youtube': return <Youtube className="h-5 w-5 text-red-500" />;
      case 'drive': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'iframe': return <LinkIcon className="h-5 w-5 text-gray-500" />;
    }
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
    <div className="container max-w-6xl mx-auto py-8">
       <div className="grid md:grid-cols-3 gap-8 items-start">
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
            <p className="text-lg text-muted-foreground mb-8">{course.description}</p>
            
            {course.content.length > 0 && (
                <Tabs defaultValue={course.content[0].id} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        {course.content.map(item => (
                            <TabsTrigger key={item.id} value={item.id} className="flex gap-2 items-center">
                               {getIcon(item.type)} {item.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                     {course.content.map(item => (
                        <TabsContent key={item.id} value={item.id}>
                            <Card>
                                <CardContent className="p-0">
                                   <div className="aspect-video">
                                        <iframe
                                            src={item.embedUrl}
                                            width="100%"
                                            height="100%"
                                            className="rounded-md"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={item.title}
                                        ></iframe>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            )}

        </div>
        <div className="md:col-span-1 sticky top-20">
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
