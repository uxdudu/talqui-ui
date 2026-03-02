import { Button } from "../ui/Button";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold text-neutral-900">Talqui</span>
        <nav className="flex gap-6 text-sm text-neutral-600">
          <a href="#" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Interfaces
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button size="medium" variant="secondary" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus-visible:ring-neutral-400">
          Ação
        </Button>
      </div>
    </header>
  );
}
