import { format, differenceInDays, addMonths, startOfDay } from 'date-fns';
import { Intervention } from '@/types/interventions';
import { getYearEndDate } from '@/utils/costCalculations';

interface GanttChartProps {
  startDate: Date;
  interventions: Intervention[];
  onEdit: (intervention: Intervention) => void;
}

export default function GanttChart({ startDate, interventions, onEdit }: GanttChartProps) {
  // Ensure start date is at the beginning of the day
  const normalizedStartDate = startOfDay(startDate);
  // End date is 3 years from start, minus 1 day
  const endDate = getYearEndDate(addMonths(normalizedStartDate, 36));
  const totalDays = differenceInDays(endDate, normalizedStartDate);

  const getPositionAndWidth = (start: Date, end: Date) => {
    // Normalize dates to start of day for consistent calculations
    const normalizedStart = startOfDay(start);
    const normalizedEnd = startOfDay(end);
    
    // Calculate position as percentage from start date
    const position = Math.max(0, (differenceInDays(normalizedStart, normalizedStartDate) / totalDays) * 100);
    
    // Calculate width as percentage of total timeline
    const width = Math.min(
      100 - position,
      ((differenceInDays(normalizedEnd, normalizedStart) + 1) / totalDays) * 100 // Add 1 to include both start and end days
    );
    
    return { position, width };
  };

  // Get the label for a specific year
  const getYearLabel = (yearIndex: number) => {
    const yearStart = addMonths(normalizedStartDate, yearIndex * 12);
    const yearEnd = getYearEndDate(yearStart);
    return `${format(yearStart, 'dd/MM/yyyy')} - ${format(yearEnd, 'dd/MM/yyyy')}`;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Implementation timeline</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-400 rounded mr-2" />
            <span className="text-sm">Implementation</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
            <span className="text-sm">Ongoing</span>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-3 border-b py-2 px-4">
          {[0, 1, 2].map((year) => (
            <div key={year} className="text-sm text-gray-600">
              {getYearLabel(year)}
            </div>
          ))}
        </div>

        <div className="divide-y">
          {interventions.map((intervention) => (
            <div key={intervention.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{intervention.name}</span>
                <button
                  onClick={() => onEdit(intervention)}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  Edit
                </button>
              </div>
              <div className="relative h-8">
                {/* Implementation timeline */}
                <div
                  className="absolute h-4 bg-orange-400 rounded"
                  style={{
                    left: `${getPositionAndWidth(
                      intervention.timeline.implementationStartDate,
                      intervention.timeline.implementationEndDate
                    ).position}%`,
                    width: `${getPositionAndWidth(
                      intervention.timeline.implementationStartDate,
                      intervention.timeline.implementationEndDate
                    ).width}%`,
                  }}
                />
                {/* Ongoing timeline */}
                <div
                  className="absolute h-4 bg-blue-500 rounded"
                  style={{
                    left: `${getPositionAndWidth(
                      intervention.timeline.ongoingStartDate,
                      intervention.timeline.ongoingEndDate
                    ).position}%`,
                    width: `${getPositionAndWidth(
                      intervention.timeline.ongoingStartDate,
                      intervention.timeline.ongoingEndDate
                    ).width}%`,
                    top: '20px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 