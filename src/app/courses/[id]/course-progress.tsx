"use client";

import type { Course } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Circle, CircleCheck } from 'lucide-react';

interface CourseProgressProps {
  course: Course;
}

export default function CourseProgress({ course }: CourseProgressProps) {
  const { progress, toggleLessonComplete } = useAuth();
  
  const courseProgress = progress[course.id] || { completedLessons: [] };
  const completedLessons = new Set(courseProgress.completedLessons);
  
  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const completedCount = completedLessons.size;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Progress</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Progress value={progressPercentage} className="w-full" />
          <span className="text-sm text-muted-foreground font-medium">{Math.round(progressPercentage)}%</span>
        </div>
         <p className="text-sm text-muted-foreground mt-1">{completedCount} of {totalLessons} lessons completed</p>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={course.sections.map(s => s.id)} className="w-full">
          {course.sections.map((section) => (
            <AccordionItem value={section.id} key={section.id}>
              <AccordionTrigger className="font-semibold">{section.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {section.lessons.map((lesson) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => toggleLessonComplete(course.id, lesson.id)}
                          className="w-full flex items-center gap-3 text-left p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          {isCompleted ? (
                            <CircleCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={`flex-1 ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                            {lesson.title}
                          </span>
                           <span className="text-xs text-muted-foreground">{lesson.duration}m</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
