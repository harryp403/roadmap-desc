import { format, addYears } from 'date-fns';
import { YearlyBudget } from '@/types/interventions';

interface BudgetGaugesProps {
  startDate: Date;
  yearlyBudgets: YearlyBudget[];
}

export default function BudgetGauges({ startDate, yearlyBudgets }: BudgetGaugesProps) {
  const formatDateRange = (yearIndex: number) => {
    const start = addYears(startDate, yearIndex);
    const end = addYears(start, 1);
    return `${format(start, 'dd/MM/yyyy')}-${format(end, 'dd/MM/yyyy')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {yearlyBudgets.map((budget, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Year {index + 1} Investment</h3>
            <span className="text-sm text-gray-500">{formatDateRange(index)}</span>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-300 ${
                budget.isOverBudget ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{
                width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span>Investment</span>
            <span className={budget.isOverBudget ? 'text-red-500' : 'text-green-500'}>
              ${budget.spent.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>{budget.isOverBudget ? 'Over by' : 'Under by'}</span>
            <span className={budget.isOverBudget ? 'text-red-500' : 'text-green-500'}>
              ${Math.abs(budget.allocated - budget.spent).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 