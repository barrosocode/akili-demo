import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
}

export function AppShell({ children, sidebar, header }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
          {sidebar}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          {header}
          <main
            id="main-content"
            className={cn("mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8")}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
