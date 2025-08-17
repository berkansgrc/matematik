"use client";

import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır." }),
  email: z.string().email({ message: "Geçersiz e-posta adresi." }),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    // Profil güncelleme mantığı burada olacak
    console.log(values);
    toast({
      title: "Başarılı",
      description: "Profiliniz güncellendi.",
    });
  }
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Profil Ayarları</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
          <CardDescription>Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İsim</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Değişiklikleri Kaydet</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
