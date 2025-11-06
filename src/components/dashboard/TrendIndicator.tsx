interface TrendIndicatorProps {
  value: number;
  previousValue: number;
  format?: 'number' | 'percent' | 'days';
  showPrevious?: boolean;
}

export function TrendIndicator({
  value,
  previousValue,
  format = 'number',
  showPrevious = false
}: TrendIndicatorProps) {
  const change = value - previousValue;
  const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
  const isPositive = change > 0;
  const isNeutral = Math.abs(changePercent) < 2;

  const formatValue = (val: number) => {
    switch (format) {
      case 'percent':
        return `${val.toFixed(1)}%`;
      case 'days':
        return `${val.toFixed(1)} días`;
      default:
        return val.toLocaleString('es-MX');
    }
  };

  if (isNeutral) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-3 w-3"
        >
          <path d="M5 12h14" />
        </svg>
        <span>Sin cambios</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 text-xs ${
        isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      }`}>
        {isPositive ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-3 w-3"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-3 w-3"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        )}
        <span className="font-medium">{Math.abs(changePercent).toFixed(1)}%</span>
      </div>
      {showPrevious && (
        <span className="text-xs text-muted-foreground">
          vs {formatValue(previousValue)}
        </span>
      )}
    </div>
  );
}
