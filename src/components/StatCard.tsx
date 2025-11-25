import { BarChart, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: BarChart;
  color: 'emerald' | 'blue' | 'amber';
}

export function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-neutral-500" />
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change}</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">{title}</p>
        <p className="text-3xl font-semibold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}