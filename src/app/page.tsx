
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/clients');
  }, [router]);

  return (
    <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg">Loading Mesuette...</p>
    </div>
  );
}
