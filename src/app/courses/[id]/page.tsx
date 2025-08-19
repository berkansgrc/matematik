
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCourse } from '@/lib/course-service';
import type { Course } from '@/lib/types';
import Image from 'next/image';
import { Book, Clock, Youtube, FileText, Link as LinkIcon, Loader2, AppWindow } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const getIcon = (type: string) => {
    switch(type) {
      case 'youtube': return <Youtube className="h-5 w-5 text-red-500" />;
      case 'drive': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'iframe': return <AppWindow className="h-5 w-5 text-gray-500" />;
    }
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const contentId = searchParams.get('contentId');
  const courseId = params.id;

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      setLoading(true);
      const fetchedCourse = await getCourse(courseId);
      if (fetchedCourse) {
        setCourse(fetchedCourse);
      } else {
        console.error("Course not found");
      }
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
        <div className="container max-w-6xl mx-auto py-8">
            <div className="space-y-8">
                <div>
                    <Skeleton className="relative aspect-video rounded-lg w-full mb-6" />
                    <Skeleton className="h-10 w-3/4 mb-2" />
                    <div className="flex items-center gap-4 mb-4">
                       <Skeleton className="h-5 w-24" />
                       <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-20 w-full mb-8" />
                </div>
            </div>
        </div>
    );
  }

  if (!course) {
     return (
        <div className="container max-w-6xl mx-auto py-8 text-center">
            <h1 className="text-2xl font-bold">Kurs Bulunamadı</h1>
            <p className="text-muted-foreground">Aradığınız kurs mevcut değil veya kaldırılmış olabilir.</p>
        </div>
    )
  }

  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const totalDuration = course.sections.reduce((acc, section) => {
    return acc + section.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.duration, 0);
  }, 0);
  
  const defaultTab = contentId || course.content[0]?.id;

  return (
    <div className="container max-w-6xl mx-auto py-8">
       <div className="space-y-8">
        <div>
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
                    <span>{totalLessons} ders</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Yaklaşık {Math.floor(totalDuration / 60)}s {totalDuration % 60}d</span>
                </div>
            </div>
            <p className="text-lg text-muted-foreground mb-8">{course.description}</p>
            
            {course.content && course.content.length > 0 ? (
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-4 h-auto">
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
            ) : (
                 <div className="text-center py-8 text-muted-foreground bg-secondary rounded-md">
                    <p>Bu kurs için henüz içerik eklenmemiş.</p>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}
