"use client";

import type { Course } from '@/lib/types';
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
  completedLessons: Set<string>;
  onLessonClick: (lessonId: string) => void;
}

export function CourseProgress({ course, completedLessons, onLessonClick }: CourseProgressProps) {
  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const progressPercentage = (completedLessons.size / totalLessons) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kurs İlerlemesi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-muted-foreground">Genel İlerleme</span>
              <span className="text-sm font-medium">{completedLessons.size} / {totalLessons} tamamlandı</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          <Accordion type="single" collapsible className="w-full" defaultValue={`item-${course.sections[0]?.id}`}>
            {course.sections.map((section) => (
              <AccordionItem value={`item-${section.id}`} key={section.id}>
                <AccordionTrigger className="font-semibold">{section.title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-2">
                    {section.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center gap-3">
                        <button 
                          onClick={() => onLessonClick(lesson.id)}
                          className="flex items-center gap-3 text-left w-full hover:text-primary transition-colors disabled:text-muted-foreground disabled:cursor-not-allowed"
                        >
                          {completedLessons.has(lesson.id) ? (
                            <CircleCheck className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className="flex-1">{lesson.title}</span>
                          <span className="text-xs text-muted-foreground">{lesson.duration} dk</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
