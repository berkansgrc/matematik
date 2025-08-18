
"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getCourses, addCourse, updateCourse, deleteCourse } from '@/lib/course-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Course, EmbeddableContent, EmbedType } from '@/lib/types';
import { Youtube, FileText, Link as LinkIcon, PlusCircle, Trash2, Edit, Loader2, BookOpen, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const courseFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "Konu başlığı en az 3 karakter olmalıdır." }),
  category: z.enum(["5. Sınıf", "6. Sınıf", "7. Sınıf", "LGS"], { required_error: "Kategori seçmelisiniz." }),
});

const contentFormSchema = z.object({
  title: z.string().min(3, { message: "İçerik başlığı en az 3 karakter olmalıdır." }),
  type: z.enum(["youtube", "drive", "iframe"], { required_error: "İçerik türü seçmelisiniz." }),
  url: z.string().url({ message: "Geçerli bir URL girmelisiniz." }),
});


export default function AdminPage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("5. Sınıf");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourseForContent, setSelectedCourseForContent] = useState<Course | null>(null);

  const courseForm = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
  });

  const contentForm = useForm<z.infer<typeof contentFormSchema>>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: { title: "", url: "" },
  });
  
  const categories: ("5. Sınıf" | "6. Sınıf" | "7. Sınıf" | "LGS")[] = ["5. Sınıf", "6. Sınıf", "7. Sınıf", "LGS"];

  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses);
      setIsLoading(false);
    }
    fetchCourses();
  }, []);

  const getEmbedUrl = (url: string, type: EmbedType): string => {
    if (type === 'youtube') {
      const videoIdMatch = url.match(/(?:v=|\/embed\/|\/)([\w-]{11})(&.*)?$/);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
    }
    if (type === 'drive') {
      return url.replace('/view', '/preview').replace('/edit', '/preview');
    }
    return url;
  };

  const openCourseDialog = (course: Course | null = null) => {
    setEditingCourse(course);
    if (course) {
      courseForm.reset({ id: course.id, title: course.title, category: course.category as any });
    } else {
      courseForm.reset({ id: undefined, title: '', category: activeTab as any });
    }
    setDialogOpen(true);
  };
  
  async function handleCourseSubmit(values: z.infer<typeof courseFormSchema>) {
    setIsSubmitting(true);
    try {
      if (editingCourse) { // Update existing course
        const updatedData = { title: values.title, category: values.category };
        await updateCourse(editingCourse.id, updatedData);
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...updatedData } : c));
        toast({ title: "Başarılı!", description: "Konu güncellendi." });
      } else { // Create new course
        const newCourseData = {
          title: values.title,
          description: '', // No description field in the new form
          category: values.category,
          imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(values.title)}`,
          sections: [],
          content: [],
        };
        const newCourseId = await addCourse(newCourseData);
        const newCourse = { id: newCourseId, ...newCourseData };
        setCourses(prev => [...prev, newCourse]);
        toast({ title: "Başarılı!", description: "Yeni konu eklendi." });
      }
      setDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      toast({ title: "Hata!", description: "İşlem sırasında bir sorun oluştu.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  async function handleCourseDelete(courseId: string) {
      try {
        await deleteCourse(courseId);
        setCourses(prev => prev.filter(c => c.id !== courseId));
        toast({ title: "Başarılı!", description: "Konu silindi.", variant: "destructive" });
      } catch (error) {
        toast({ title: "Hata!", description: "Konu silinirken bir sorun oluştu.", variant: "destructive" });
      }
  }

  const openContentDialog = (course: Course) => {
    setSelectedCourseForContent(course);
    contentForm.reset();
    setContentDialogOpen(true);
  };

  async function handleContentSubmit(values: z.infer<typeof contentFormSchema>) {
    if (!selectedCourseForContent) return;
    setIsSubmitting(true);
    
    const newContent: EmbeddableContent = {
      id: `content-${Date.now()}`,
      title: values.title,
      type: values.type as EmbedType,
      url: values.url,
      embedUrl: getEmbedUrl(values.url, values.type as EmbedType),
    };

    const updatedContent = [...(selectedCourseForContent.content || []), newContent];

    try {
        await updateCourse(selectedCourseForContent.id, { content: updatedContent });
        
        const updatedCourse = { ...selectedCourseForContent, content: updatedContent };

        setCourses(prev => prev.map(course => 
          course.id === selectedCourseForContent.id ? updatedCourse : course
        ));
        
        toast({ title: "Başarılı!", description: "Yeni içerik eklendi." });
        setContentDialogOpen(false);
    } catch(error) {
         toast({ title: "Hata!", description: "İçerik eklenirken bir sorun oluştu.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  }

  async function handleDeleteContent(courseId: string, contentId: string) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    const updatedContent = course.content.filter(item => item.id !== contentId);

    try {
        await updateCourse(courseId, { content: updatedContent });
        const updatedCourse = { ...course, content: updatedContent };
        setCourses(prev => prev.map(c => c.id === courseId ? updatedCourse : c));
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
  };

  const renderCoursesForCategory = (category: string) => {
    const categoryCourses = courses.filter(c => c.category === category);

    if (isLoading) {
        return <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }
    
    if (categoryCourses.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-8">Bu sınıf için henüz konu eklenmedi.</p>;
    }
    
    return (
        <Accordion type="multiple" className="space-y-4">
            {categoryCourses.map(course => (
                 <AccordionItem value={course.id} key={course.id} className="bg-card border rounded-lg px-4">
                     <div className="flex items-center justify-between h-16">
                         <AccordionTrigger className="w-full text-left hover:no-underline font-semibold text-lg py-4">
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-primary" />
                                {course.title}
                            </div>
                         </AccordionTrigger>
                         <div className="flex items-center gap-4 pl-4">
                             <Button variant="ghost" size="sm" onClick={() => openCourseDialog(course)}>
                                <Edit className="h-4 w-4 mr-2" /> Düzenle
                             </Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4 mr-2" /> Sil
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>"{course.title}" konusunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => handleCourseDelete(course.id)}>Sil</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                             </AlertDialog>
                         </div>
                     </div>
                     <AccordionContent className="pt-0 pb-4">
                         <div className="border-t -mx-4 px-4 pt-4">
                             {course.content && course.content.length > 0 ? (
                                <div className="space-y-3">
                                    {course.content.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                                            <div className="flex items-center gap-3">
                                                {getIcon(item.type)}
                                                <span className="font-medium">{item.title}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteContent(course.id, item.id)}>
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                             ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Bu konu için henüz içerik eklenmedi.</p>
                             )}
                              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => openContentDialog(course)}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Yeni İçerik Ekle
                            </Button>
                         </div>
                     </AccordionContent>
                 </AccordionItem>
            ))}
        </Accordion>
    );
  };


  return (
    <div className="bg-secondary/50 min-h-screen">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
            <div>
                 <h1 className="text-3xl font-bold text-primary">Yönetim Paneli</h1>
                 <p className="text-muted-foreground">Sınıflara göre ders kaynaklarını (video, döküman, uygulama) buradan yönetin.</p>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
                {categories.map(cat => (
                    <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                ))}
            </TabsList>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openCourseDialog(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Yeni Konu Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCourse ? 'Konuyu Düzenle' : 'Yeni Konu Ekle'}</DialogTitle>
                </DialogHeader>
                 <Form {...courseForm}>
                    <form onSubmit={courseForm.handleSubmit(handleCourseSubmit)} className="space-y-4">
                      <FormField control={courseForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Konu Başlığı</FormLabel><FormControl><Input placeholder="Örn: Doğal Sayılar" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={courseForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>Sınıf</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Bir sınıf seçin" /></SelectTrigger></FormControl><SelectContent>{categories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                      <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>İptal</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingCourse ? 'Güncelle' : 'Oluştur'}</Button></div>
                    </form>
                  </Form>
              </DialogContent>
            </Dialog>
          </div>
          {categories.map(cat => (
             <TabsContent key={cat} value={cat}>
                 {renderCoursesForCategory(cat)}
            </TabsContent>
          ))}
        </Tabs>
        
         <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>"{selectedCourseForContent?.title}" için Yeni İçerik Ekle</DialogTitle></DialogHeader>
                <Form {...contentForm}>
                    <form onSubmit={contentForm.handleSubmit(handleContentSubmit)} className="space-y-4">
                        <FormField control={contentForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Başlık</FormLabel><FormControl><Input placeholder="Örn: Ders 1 Videosu" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={contentForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>İçerik Türü</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Bir tür seçin" /></SelectTrigger></FormControl><SelectContent><SelectItem value="youtube">YouTube Videosu</SelectItem><SelectItem value="drive">Google Drive Dökümanı</SelectItem><SelectItem value="iframe">Diğer (Link)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={contentForm.control} name="url" render={({ field }) => (<FormItem><FormLabel>URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setContentDialogOpen(false)}>İptal</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4"/>} İçerik Ekle</Button></div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

    