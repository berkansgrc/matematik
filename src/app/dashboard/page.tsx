"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { courses } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, progress } = useAuth();

  const userCourses = courses.filter(course => progress[course.id] && progress[course.id].completedLessons.length > 0);
  
  const getCourseProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    const courseProgress = progress[courseId] || { completedLessons: [] };
    const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
    const completedCount = courseProgress.completedLessons.length;
    return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Hoş Geldin, {user?.name}!</h1>
      
      {userCourses.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Kursların</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userCourses.map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id} className="group">
                <Card className="flex flex-col h-full overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                  <CardHeader className="p-0">
                     <div className="aspect-video overflow-hidden">
                        <Image
                            src={course.imageUrl}
                            alt={course.title}
                            width={600}
                            height={400}
                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            data-ai-hint="online course"
                        />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-4">
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{course.title}</CardTitle>
                    <div className="mt-4">
                        <Progress value={getCourseProgress(course.id)} className="w-full h-2" />
                        <p className="text-sm text-muted-foreground mt-1">{Math.round(getCourseProgress(course.id))}% tamamlandı</p>
                    </div>
                  </CardContent>
                   <CardFooter className="p-4 pt-0">
                      <div className="text-sm font-semibold text-accent flex items-center gap-1">
                          Kursa Devam Et <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">Henüz bir kursa başlamadınız.</h2>
            <p className="text-muted-foreground mt-2">Mevcut kursları keşfedin ve öğrenmeye başlayın.</p>
            <Button asChild className="mt-4">
                <Link href="/courses">Kursları Görüntüle</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
