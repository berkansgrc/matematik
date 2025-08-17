import Link from 'next/link';
import Image from 'next/image';
import { courses } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function Grade7Page() {
  const gradeCourses = courses.filter(course => course.category === '7. Sınıf');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">7. Sınıf Kursları</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gradeCourses.map((course) => (
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
                <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{course.title}</CardTitle>
                <CardDescription className="mt-2 text-sm">{course.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                  <div className="text-sm font-semibold text-accent flex items-center gap-1">
                      Kursa Git <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
         {gradeCourses.length === 0 && (
          <p className="text-muted-foreground col-span-full">Bu sınıf için henüz kurs bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
}
