"use client";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-10">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-neutral-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
