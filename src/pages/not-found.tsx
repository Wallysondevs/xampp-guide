import { Link } from "wouter";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2 mt-0 border-0">
          Página não encontrada
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          O tópico que você procura ainda não existe — ou o link está quebrado.
          Volte ao início e use o menu lateral para navegar.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
