
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCourses } from '@/lib/course-service';
import type { Course, EmbeddableContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Video, FileText, AppWindow } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function Grade6Page() {
  const [gradeCourses, setGradeCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const allCourses = await getCourses();
        const filteredCourses = allCourses.filter(course => course.category === '6. Sınıf');
        setGradeCourses(filteredCourses);
      } catch (error) {
        console.error("Failed to fetch courses for 6th grade:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const renderContent = (courseId: string, content: EmbeddableContent[]) => {
    const videos = content.filter(c => c.type === 'youtube');
    const documents = content.filter(c => c.type === 'drive');
    const applications = content.filter(c => c.type === 'iframe');

    return (
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/80">
          <TabsTrigger value="videos" disabled={videos.length === 0}><Video className="mr-2 h-4 w-4"/>Videolar</TabsTrigger>
          <TabsTrigger value="documents" disabled={documents.length === 0}><FileText className="mr-2 h-4 w-4"/>Dökümanlar</TabsTrigger>
          <TabsTrigger value="applications" disabled={applications.length === 0}><AppWindow className="mr-2 h-4 w-4"/>Uygulamalar</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videos.map(item => (
                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Video className="h-5 w-5 text-red-500"/>
                            <span className="font-medium">{item.title}</span>
                        </div>
                    </a>
                ))}
            </div>
        </TabsContent>
        <TabsContent value="documents" className="pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documents.map(item => (
                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-500"/>
                            <span className="font-medium">{item.title}</span>
                        </div>
                    </a>
                ))}
            </div>
        </TabsContent>
        <TabsContent value="applications" className="pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applications.map(item => (
                    <Link key={item.id} href={`/courses/${courseId}?contentId=${item.id}`} className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <AppWindow className="h-5 w-5 text-gray-500"/>
                            <span className="font-medium">{item.title}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="bg-secondary/40 min-h-[calc(100vh-3.5rem)]">
        <div className="container py-8 md:py-12">
             <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Ana Sayfa
                    </Link>
                </Button>
                <h1 className="text-4xl font-bold text-primary">6. Sınıf Kaynakları</h1>
                <p className="text-lg text-muted-foreground mt-2">Matematik temellerini sağlamlaştırın.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : (
                <Accordion type="multiple" className="space-y-4">
                    {gradeCourses.length > 0 ? (
                        gradeCourses.map((course) => (
                            <AccordionItem value={course.id} key={course.id} className="bg-card border rounded-lg">
                                <AccordionTrigger className="text-lg font-semibold px-6 py-4 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                        {course.title}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4">
                                     {course.content && course.content.length > 0 ? (
                                        renderContent(course.id, course.content)
                                    ) : (
                                        <p className="text-muted-foreground text-center py-4">Bu konu için henüz içerik eklenmemiş.</p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-card border rounded-lg">
                            <p className="text-muted-foreground">Bu sınıf için henüz kurs bulunmamaktadır.</p>
                        </div>
                    )}
                </Accordion>
            )}
        </div>
    </div>
  );
}
