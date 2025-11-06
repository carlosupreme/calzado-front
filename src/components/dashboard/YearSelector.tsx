import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface YearSelectorProps {
  availableYears: number[];
  selectedYears: number[];
  onToggleYear: (year: number) => void;
  onSelectAll: () => void;
  singleSelect?: boolean;
}

export function YearSelector({
  availableYears,
  selectedYears,
  onToggleYear,
  onSelectAll,
  singleSelect = false,
}: YearSelectorProps) {
  const handleYearClick = (year: number) => {
    if (singleSelect) {
      // In single select mode, only one year can be selected
      onToggleYear(year);
    } else {
      // In multi-select mode, toggle the year
      onToggleYear(year);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {singleSelect ? 'Año:' : 'Comparar años:'}
      </span>

      {availableYears.map((year) => {
        const isSelected = selectedYears.includes(year);
        return (
          <Button
            key={year}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleYearClick(year)}
            className="h-8"
          >
            {year}
            {isSelected && !singleSelect && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0">
                ✓
              </Badge>
            )}
          </Button>
        );
      })}

      {!singleSelect && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          disabled={selectedYears.length === availableYears.length}
          className="h-8 text-xs ml-2 border-l pl-2"
        >
          Todos los años
        </Button>
      )}

      {selectedYears.length > 1 && (
        <Badge variant="outline" className="ml-2">
          {selectedYears.length} años seleccionados
        </Badge>
      )}
    </div>
  );
}
