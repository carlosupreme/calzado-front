import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BusinessUnitFilterProps {
  units: string[];
  selectedUnits: string[];
  onToggleUnit: (unit: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function BusinessUnitFilter({
  units,
  selectedUnits,
  onToggleUnit,
  onSelectAll,
  onClearAll,
}: BusinessUnitFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Filtrar por unidad:</span>

      {units.map((unit) => {
        const isSelected = selectedUnits.includes(unit);
        return (
          <Button
            key={unit}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleUnit(unit)}
            className="h-8"
          >
            {unit}
            {isSelected && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0">
                ✓
              </Badge>
            )}
          </Button>
        );
      })}

      <div className="flex gap-1 ml-2 border-l pl-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          disabled={selectedUnits.length === units.length}
          className="h-8 text-xs"
        >
          Todas
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          disabled={selectedUnits.length === 0}
          className="h-8 text-xs"
        >
          Ninguna
        </Button>
      </div>
    </div>
  );
}
