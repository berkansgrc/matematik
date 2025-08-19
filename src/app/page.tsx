
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { BookOpen, PlayCircle, Rocket, Target, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRecentVideos } from '@/lib/course-service';
import type { VideoContent } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import LottiePlayer from '@/components/lottie-player';
import HeroAnimation from '@/app/animations/hero-animation.json';

export default function HomePage() {
  const [recentVideos, setRecentVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentVideos() {
      setLoading(true);
      const videos = await getRecentVideos(6); // Fetch the 6 most recent videos
      setRecentVideos(videos);
      setLoading(false);
    }
    fetchRecentVideos();
  }, []);
  
  const getYoutubeThumbnail = (url: string) => {
      const videoIdMatch = url.match(/(?:v=|\/embed\/|\/)([\w-]{11})(&.*)?$/);
      return videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/mqdefault.jpg` : 'https://placehold.co/320x180.png';
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Geleceğinize Yön Verin, Sınırları Aşın!
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Modern ve interaktif eğitim platformumuzla 5. sınıftan LGS'ye uzanan başarı yolculuğunuzda yanınızdayız. Video dersler, interaktif alıştırmalar ve kişiselleştirilmiş öğrenme deneyimi sizi bekliyor.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Hemen Başla</Button>
                  </Link>
                  <Link href="#features">
                     <Button size="lg" variant="outline">Daha Fazla Bilgi</Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last">
                 <LottiePlayer animationData={HeroAnimation} />
              </div>
            </div>
          </div>
        </section>
        
        {/* Recent Videos Section */}
        <section id="recent-videos" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Yeni Videolar</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">En Son Eklenen Dersler</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                          En güncel konu anlatımlarını ve soru çözümlerini kaçırmayın.
                        </p>
                    </div>
                </div>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                          <div key={i} className="space-y-2">
                              <Skeleton className="aspect-video w-full rounded-lg" />
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-4 w-1/4" />
                          </div>
                      ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recentVideos.map(video => (
                          <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="group">
                              <Card className="overflow-hidden h-full flex flex-col transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                                  <CardHeader className="p-0 relative aspect-video">
                                      <Image 
                                          src={getYoutubeThumbnail(video.url)}
                                          alt={video.title}
                                          fill
                                          className="object-cover transition-transform group-hover:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                         <PlayCircle className="h-12 w-12 text-white/80" />
                                      </div>
                                  </CardHeader>
                                  <CardContent className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors flex-1">{video.title}</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <Badge variant="secondary">{video.category}</Badge>
                                        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                                            <Video className="h-4 w-4" />
                                            <span>Video Ders</span>
                                        </div>
                                    </div>
                                  </CardContent>
                              </Card>
                          </a>
                      ))}
                  </div>
                )}
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Öne Çıkan Özellikler</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Başarıya Giden Yolda En İyi Yardımcınız</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Platformumuz, öğrenme sürecinizi en verimli hale getirmek için tasarlandı.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                 <div className="flex justify-center mb-4">
                    <div className="bg-primary text-primary-foreground p-4 rounded-full">
                        <PlayCircle className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">Zengin Video İçerikleri</h3>
                <p className="text-muted-foreground">
                  Konu anlatımlarını uzman öğretmenlerden video formatında izleyin, eksiklerinizi anında giderin.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                 <div className="flex justify-center mb-4">
                    <div className="bg-primary text-primary-foreground p-4 rounded-full">
                        <Rocket className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">İnteraktif Alıştırmalar</h3>
                <p className="text-muted-foreground">
                  Öğrendiklerinizi interaktif testler ve alıştırmalar ile pekiştirin, anında geri bildirim alın.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                 <div className="flex justify-center mb-4">
                    <div className="bg-primary text-primary-foreground p-4 rounded-full">
                        <Target className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">Kişiselleştirilmiş Yol Haritası</h3>
                <p className="text-muted-foreground">
                  Performansınıza göre size özel hazırlanan çalışma programları ile hedeflerinize daha hızlı ulaşın.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                Öğrenme Maceranıza Bugün Başlayın!
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Binlerce öğrencinin arasına katılın. Sadece birkaç adımda kaydolarak tüm içeriklere anında erişim sağlayın.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-x-2">
               <Link href="/register">
                 <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Ücretsiz Kayıt Ol</Button>
               </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2025 Berkan Matematik. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
