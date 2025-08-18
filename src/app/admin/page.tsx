
"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getCourses, addCourse, updateCourse } from '@/lib/course-service';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import type { Course, EmbeddableContent, EmbedType } from '@/lib/types';
import { Youtube, FileText, Link as LinkIcon, PlusCircle, Trash2, Edit, ArrowLeft, Loader2 } from 'lucide-react';

const courseFormSchema = z.object({
  title: z.string().min(3, { message: "Başlık en az 3 karakter olmalıdır." }),
  description: z.string().min(10, { message: "Açıklama en az 10 karakter olmalıdır." }),
  category: z.enum(["5. Sınıf", "6. Sınıf", "7. Sınıf", "LGS"], { required_error: "Kategori seçmelisiniz." }),
});

const contentFormSchema = z.object({
  title: z.string().min(3, { message: "Başlık en az 3 karakter olmalıdır." }),
  type: z.enum(["youtube", "drive", "iframe"], { required_error: "İçerik türü seçmelisiniz." }),
  url: z.string().url({ message: "Geçerli bir URL girmelisiniz." }),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses);
      setIsLoading(false);
    }
    fetchCourses();
  }, []);
  

  const courseForm = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: { title: "", description: "", category: "5. Sınıf" },
  });

  const contentForm = useForm<z.infer<typeof contentFormSchema>>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: { title: "", url: "" },
  });

  const getEmbedUrl = (url: string, type: EmbedType): string => {
    if (type === 'youtube') {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (type === 'drive') {
      return url.replace('/view', '/preview').replace('/edit', '/preview');
    }
    return url;
  };
  
  async function handleCourseSubmit(values: z.infer<typeof courseFormSchema>) {
      setIsSubmitting(true);
      try {
        const newCourseData = {
            title: values.title,
            description: values.description,
            category: values.category,
            imageUrl: 'https://placehold.co/600x400.png',
            sections: [],
        };
        const newCourseId = await addCourse(newCourseData);
        const newCourse = { id: newCourseId, ...newCourseData, content: [] };
        setCourses(prev => [...prev, newCourse]);
        toast({ title: "Başarılı!", description: "Yeni kurs eklendi." });
        courseForm.reset();
        setIsCreatingCourse(false);
      } catch (error) {
        toast({ title: "Hata!", description: "Kurs eklenirken bir sorun oluştu.", variant: "destructive" });
      } finally {
        setIsSubmitting(false);
      }
  }
  
  async function handleContentSubmit(values: z.infer<typeof contentFormSchema>) {
    if (!selectedCourse) return;
    setIsSubmitting(true);
    
    const newContent: EmbeddableContent = {
      id: `content-${Date.now()}`,
      title: values.title,
      type: values.type as EmbedType,
      url: values.url,
      embedUrl: getEmbedUrl(values.url, values.type as EmbedType),
    };

    const updatedContent = [...(selectedCourse.content || []), newContent];

    try {
        await updateCourse(selectedCourse.id, { content: updatedContent });
        
        const updatedCourse = { ...selectedCourse, content: updatedContent };

        setCourses(prev => prev.map(course => 
          course.id === selectedCourse.id 
            ? updatedCourse
            : course
        ));
        
        setSelectedCourse(updatedCourse);
        
        toast({ title: "Başarılı!", description: "Yeni içerik eklendi." });
        contentForm.reset();
    } catch(error) {
         toast({ title: "Hata!", description: "İçerik eklenirken bir sorun oluştu.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  async function handleDeleteContent(contentId: string) {
    if (!selectedCourse) return;
    
    const updatedContent = selectedCourse.content.filter(item => item.id !== contentId);

    try {
        await updateCourse(selectedCourse.id, { content: updatedContent });
        const updatedCourse = { ...selectedCourse, content: updatedContent };

        setCourses(prev => prev.map(course => 
        course.id === selectedCourse.id 
            ? updatedCourse 
            : course
        ));
        
        setSelectedCourse(updatedCourse);

        toast({ title: "Başarılı!", description: "İçerik silindi.", variant: "destructive" });
    } catch (error) {
        toast({ title: "Hata!", description: "İçerik silinirken bir sorun oluştu.", variant: "destructive" });
    }
  }

  const getIcon = (type: EmbedType) => {
    switch(type) {
      case 'youtube': return <Youtube className="h-5 w-5 text-red-500" />;
      case 'drive': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'iframe': return <LinkIcon className="h-5 w-5 text-gray-500" />;
    }
  }
  
  if (selectedCourse) {
      return (
        <div className="container py-8">
            <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Tüm Kurslara Geri Dön
            </Button>
            <h1 className="text-3xl font-bold mb-1">{selectedCourse.title}</h1>
            <p className="text-muted-foreground mb-6">Kurs içeriğini yönetin.</p>
             <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Yeni İçerik Ekle</CardTitle>
                      <CardDescription>Bu kurs için video, döküman veya link ekleyin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...contentForm}>
                        <form onSubmit={contentForm.handleSubmit(handleContentSubmit)} className="space-y-4">
                          <FormField control={contentForm.control} name="title" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Başlık</FormLabel>
                                <FormControl><Input placeholder="Örn: Ders 1. Video" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField control={contentForm.control} name="type" render={({ field }) => (
                              <FormItem>
                                <FormLabel>İçerik Türü</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Bir tür seçin" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    <SelectItem value="youtube">YouTube Videosu</SelectItem>
                                    <SelectItem value="drive">Google Drive Dökümanı</SelectItem>
                                    <SelectItem value="iframe">Diğer (iFrame)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField control={contentForm.control} name="url" render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4"/>}
                            İçerik Ekle
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mevcut İçerikler</CardTitle>
                            <CardDescription>Bu kursa eklenmiş tüm içerikler.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedCourse.content && selectedCourse.content.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedCourse.content.map(item => (
                                        <Card key={item.id} className="flex items-center p-4 justify-between">
                                            <div className="flex items-center gap-4">
                                                {getIcon(item.type)}
                                                <div>
                                                    <p className="font-semibold">{item.title}</p>
                                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline truncate max-w-xs block">{item.url}</a>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContent(item.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">Bu kurs için henüz içerik eklenmedi.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
              </div>
        </div>
      )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Paneli - Kurs Yönetimi</h1>
         <Button onClick={() => setIsCreatingCourse(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Kurs Oluştur
        </Button>
      </div>

      {isCreatingCourse ? (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Yeni Kurs Oluştur</CardTitle>
                <CardDescription>Yeni bir kurs oluşturmak için bilgileri doldurun.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...courseForm}>
                    <form onSubmit={courseForm.handleSubmit(handleCourseSubmit)} className="space-y-4">
                      <FormField control={courseForm.control} name="title" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kurs Başlığı</FormLabel>
                            <FormControl><Input placeholder="Örn: 5. Sınıf Matematik" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={courseForm.control} name="description" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kurs Açıklaması</FormLabel>
                            <FormControl><Textarea placeholder="Kursa dair kısa bir açıklama..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField control={courseForm.control} name="category" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kategori / Sınıf</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Bir sınıf seçin" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="5. Sınıf">5. Sınıf</SelectItem>
                                <SelectItem value="6. Sınıf">6. Sınıf</SelectItem>
                                <SelectItem value="7. Sınıf">7. Sınıf</SelectItem>
                                <SelectItem value="LGS">LGS</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="ghost" onClick={() => setIsCreatingCourse(false)}>İptal</Button>
                        <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Kurs Oluştur
                        </Button>
                      </div>
                    </form>
                  </Form>
            </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>Mevcut Kurslar</CardTitle>
                <CardDescription>İçerik eklemek veya düzenlemek için bir kurs seçin.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : courses.length > 0 ? (
                    <div className="space-y-4">
                        {courses.map(course => (
                            <Card key={course.id} className="flex items-center p-4 justify-between">
                                <div>
                                    <p className="font-semibold">{course.title}</p>
                                    <p className="text-xs text-muted-foreground">{course.category} - {course.content?.length || 0} içerik</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course)}>
                                    <Edit className="mr-2 h-4 w-4"/>
                                    İçeriği Yönet
                                </Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Henüz hiç kurs oluşturulmadı.</p>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
