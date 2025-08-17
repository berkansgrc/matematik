
"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import { useToast } from "@/hooks/use-toast";
import { embeddableContent as initialContent } from '@/lib/data';
import type { EmbeddableContent, EmbedType } from '@/lib/types';
import { Youtube, FileText, Link as LinkIcon, PlusCircle, Trash2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, { message: "Başlık en az 3 karakter olmalıdır." }),
  type: z.enum(["youtube", "drive", "iframe"], { required_error: "İçerik türü seçmelisiniz." }),
  url: z.string().url({ message: "Geçerli bir URL girmelisiniz." }),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [content, setContent] = useState<EmbeddableContent[]>(initialContent);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const getEmbedUrl = (url: string, type: EmbedType): string => {
    if (type === 'youtube') {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (type === 'drive') {
      return url.replace('/edit', '/preview');
    }
    return url;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newContent: EmbeddableContent = {
      id: `content-${Date.now()}`,
      title: values.title,
      type: values.type as EmbedType,
      url: values.url,
      embedUrl: getEmbedUrl(values.url, values.type as EmbedType),
    };

    setContent(prev => [...prev, newContent]);
    
    toast({
      title: "Başarılı!",
      description: "Yeni içerik eklendi.",
    });
    form.reset();
  }
  
  function handleDelete(id: string) {
      setContent(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Başarılı!",
        description: "İçerik silindi.",
        variant: "destructive"
      });
  }
  
  const getIcon = (type: EmbedType) => {
    switch(type) {
      case 'youtube': return <Youtube className="h-5 w-5 text-red-500" />;
      case 'drive': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'iframe': return <LinkIcon className="h-5 w-5 text-gray-500" />;
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Paneli - İçerik Yönetimi</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Yeni İçerik Ekle</CardTitle>
              <CardDescription>Video, döküman veya uygulama linki ekleyin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlık</FormLabel>
                        <FormControl>
                          <Input placeholder="Örn: Matematik Dersi 1. Video" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İçerik Türü</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Bir tür seçin" />
                            </SelectTrigger>
                          </FormControl>
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
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4"/>
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
                    <CardDescription>Eklediğiniz tüm içeriklerin listesi.</CardDescription>
                </CardHeader>
                <CardContent>
                    {content.length > 0 ? (
                        <div className="space-y-4">
                            {content.map(item => (
                                <Card key={item.id} className="flex items-center p-4 justify-between">
                                    <div className="flex items-center gap-4">
                                        {getIcon(item.type)}
                                        <div>
                                            <p className="font-semibold">{item.title}</p>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline truncate">{item.url}</a>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">Henüz hiç içerik eklenmedi.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
