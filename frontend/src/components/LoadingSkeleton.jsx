export const CardSkeleton = () => (
  <div className="glass p-6 rounded-xl animate-pulse">
    <div className="h-4 bg-border rounded w-1/3 mb-4"></div>
    <div className="h-8 bg-border rounded w-1/2"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass p-6 rounded-xl animate-pulse h-75 flex flex-col justify-end">
    <div className="flex justify-between items-end h-50 mt-8 gap-4">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="w-full bg-border rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
      ))}
    </div>
  </div>
);

export const ListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="glass p-4 rounded-lg flex justify-between items-center animate-pulse">
        <div className="flex-1">
          <div className="h-5 bg-border rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-border rounded w-1/4"></div>
        </div>
        <div className="h-8 w-20 bg-border rounded"></div>
      </div>
    ))}
  </div>
);
