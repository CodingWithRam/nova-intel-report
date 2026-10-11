import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; action?: () => void }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 py-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none border-b border-zinc-100 dark:border-zinc-800/50">
      <div className="flex items-center space-x-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0">
        <Home className="w-3.5 h-3.5" />
        <span className="cursor-pointer font-semibold" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Nova Intel
        </span>
      </div>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1 md:space-x-2 shrink-0">
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
          {item.action ? (
            <button
              onClick={item.action}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:underline cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-zinc-800 dark:text-zinc-200 font-medium truncate max-w-[120px] md:max-w-[200px]">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
