import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export function WorkforceChart() {
  const data = [
    { month: 'Jan', deployed: 120, available: 180 },
    { month: 'Feb', deployed: 135, available: 165 },
    { month: 'Mar', deployed: 142, available: 158 },
    { month: 'Apr', deployed: 138, available: 162 },
    { month: 'May', deployed: 155, available: 145 },
    { month: 'Jun', deployed: 156, available: 144 },
  ];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-2 md:p-6">
      <div className="mb-6">
        <h2 className="text-neutral-900 mb-1">Workforce Deployment Trends</h2>
        <p className="text-sm text-neutral-500">Monthly deployment vs availability statistics</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#a3a3a3"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#a3a3a3"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="deployed" fill="#10b981" radius={[40, 40, 40, 40]} />
            <Bar dataKey="available" fill="#d4d4d4" radius={[40, 40, 40, 40]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
          <span className="text-sm text-neutral-600">Deployed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-neutral-300"></div>
          <span className="text-sm text-neutral-600">Available</span>
        </div>
      </div>
    </div>
  );
}