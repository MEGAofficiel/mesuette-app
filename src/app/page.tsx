
"use client";

// Nous allons afficher un contenu simple pour tester le rendu de base et le thème.
// Les imports pour useRouter, useEffect, Loader2 ne sont plus nécessaires pour cette version de test.

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4"> {/* Adjusted: h-full, removed bg-background */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4"> {/* Ensured: text-foreground */}
          Mesuette
        </h1>
        <p className="text-xl text-foreground mb-2">
          Application de gestion des mesures pour tailleurs.
        </p>
        <p className="text-md text-muted-foreground mb-6">
          Si vous voyez cette page avec un fond clair et du texte lisible, les styles de base fonctionnent.
        </p>
        <a
          href="/clients"
          className="inline-block px-6 py-3 mt-4 text-lg font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Accéder à la liste des clients
        </a>
      </div>
    </div>
  );
}
