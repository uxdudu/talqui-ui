import { type ReactNode } from "react";
import { Header } from "./Header";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="p-6">{children}</main>
    </div>
  );
}
