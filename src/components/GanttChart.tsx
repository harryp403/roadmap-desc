import { format, differenceInDays, addYears } from 'date-fns';
import { Intervention } from '@/types/interventions';

interface GanttChartProps {
  startDate: Date;
  interventions: Intervention[];
  onEdit: (intervention: Intervention) => void;
}

export default function GanttChart({ startDate, interventions, onEdit }: GanttChartProps) {
  const endDate = addYears(startDate, 3);
  const totalDays = differenceInDays(endDate, startDate);

  const getPositionAndWidth = (start: Date, end: Date) => {
    const position = Math.max(0, (differenceInDays(start, startDate) / totalDays) * 100);
    const width = Math.min(
      100 - position,
      (differenceInDays(end, start) / totalDays) * 100
    );
    return { position, width };
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
          {[0, 1, 2].map((year) => {
            const yearStart = addYears(startDate, year);
            const yearEnd = addYears(yearStart, 1);
            return (
              <div key={year} className="text-sm text-gray-600">
                {format(yearStart, 'dd/MM/yyyy')} - {format(yearEnd, 'dd/MM/yyyy')}
              </div>
            );
          })}
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