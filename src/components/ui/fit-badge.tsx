
import { cn } from "@/lib/utils";

type FitCategory = 'Good Fit' | 'Maybe Fit' | 'Not a Fit';

interface FitBadgeProps {
  category: FitCategory;
  className?: string;
}

export function FitBadge({ category, className }: FitBadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium";
  
  const categoryClasses = {
    'Good Fit': 'bg-fit-good-bg text-fit-good',
    'Maybe Fit': 'bg-fit-maybe-bg text-fit-maybe',
    'Not a Fit': 'bg-fit-not-bg text-fit-not'
  };

  const icons = {
    'Good Fit': '✅',
    'Maybe Fit': '🤔',
    'Not a Fit': '❌'
  };

  return (
    <span className={cn(baseClasses, categoryClasses[category], className)}>
      <span className="mr-1">{icons[category]}</span>
      {category}
    </span>
  );
}
