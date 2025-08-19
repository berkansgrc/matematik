
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, User as UserIcon, LogOut, LayoutDashboard, Settings, LogIn, Shield, Home, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const navLinks = [
      { href: '/sinif/5', label: '5. Sınıf' },
      { href: '/sinif/6', label: '6. Sınıf' },
      { href: '/sinif/7', label: '7. Sınıf' },
      { href: '/sinif/lgs', label: 'LGS' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M42 42H6V6H42V42Z" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M14 14H22V22H14V14Z" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary-foreground))" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M26 26H34V34H26V26Z" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary-foreground))" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M26 14L34 14" stroke="hsl(var(--primary-foreground))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 26L22 26" stroke="hsl(var(--primary-foreground))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M26 20L34 20" stroke="hsl(var(--primary-foreground))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 32L22 32" stroke="hsl(var(--primary-foreground))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold ml-2 text-lg">Berkan Matematik</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-2 text-sm font-medium">
             <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                <Home className="h-5 w-5" />
             </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        Sınıflar <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {navLinks.map((link) => (
                      <DropdownMenuItem key={link.href} onClick={() => router.push(link.href)}>
                        {link.label}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
      
        <div className="flex items-center justify-end space-x-2 pl-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profil Ayarları</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Paneli</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push('/login')}>
                    Giriş Yap
                </Button>
                 <Button className="bg-accent hover:bg-accent/90" onClick={() => router.push('/register')}>
                    Kayıt Ol
                </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
