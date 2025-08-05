
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Ruler, History, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 text-center">
      <main className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Image 
            src="https://storage.googleapis.com/project-os-frontend/codellama-v1/images/mesuette/6c207928-84a1-42d3-a5c6-7a72d6e3f01c.png" 
            alt="Mesuette App Logo" 
            width={120} 
            height={120}
            className="mx-auto mb-6 rounded-full shadow-lg"
            data-ai-hint="tailor sewing machine logo"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Bienvenue sur Mesuette
          </h1>
          <div className="text-left text-muted-foreground mb-10 mx-auto max-w-md space-y-3">
             <p className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
              <span>Gérez facilement vos clients et leurs informations de contact.</span>
            </p>
             <p className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
              <span>Saisissez des mesures détaillées pour différents types de vêtements.</span>
            </p>
             <p className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
              <span>Consultez l'historique complet des mesures pour chaque client.</span>
            </p>
             <p className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                <span>Suivez le statut de chaque commande : en cours, terminée ou livrée.</span>
            </p>
          </div>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
            <Link href="/clients">
              Commencer la gestion des clients
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

      </main>
    </div>
  );
}
