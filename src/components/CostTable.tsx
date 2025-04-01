import { useState } from 'react';
import { format, addYears } from 'date-fns';
import { Intervention } from '@/types/interventions';

interface CostTableProps {
  startDate: Date;
  interventions: Intervention[];
}

export default function CostTable({ startDate, interventions }: CostTableProps) {
  const [expandedIntervention, setExpandedIntervention] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalCost = (costs: Intervention['costs']) => {
    return (
      costs.implementationCost +
      costs.ongoingCostPEPM +
      costs.ongoingCostFixed +
      costs.oneTimeFixedFee
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Investment breakdown</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Selected interventions
              </th>
              {[0, 1, 2].map((year) => (
                <th
                  key={year}
                  className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {format(addYears(startDate, year), 'yyyy')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interventions.map((intervention) => (
              <>
                <tr key={intervention.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          setExpandedIntervention(
                            expandedIntervention === intervention.id ? null : intervention.id
                          )
                        }
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {expandedIntervention === intervention.id ? '▼' : '▶'}
                      </button>
                      <span className="ml-2">{intervention.name}</span>
                    </div>
                  </td>
                  {[0, 1, 2].map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-right">
                      {formatCurrency(calculateTotalCost(intervention.costs))}
                    </td>
                  ))}
                </tr>
                {expandedIntervention === intervention.id && (
                  <>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-2 pl-12">Implementation Cost (Fixed)</td>
                      {[0, 1, 2].map((year) => (
                        <td key={year} className="px-6 py-2 text-right">
                          {formatCurrency(intervention.costs.implementationCost)}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-2 pl-12">Ongoing Cost (PEPM)</td>
                      {[0, 1, 2].map((year) => (
                        <td key={year} className="px-6 py-2 text-right">
                          {formatCurrency(intervention.costs.ongoingCostPEPM)}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-2 pl-12">Ongoing Cost (Fixed Annual)</td>
                      {[0, 1, 2].map((year) => (
                        <td key={year} className="px-6 py-2 text-right">
                          {formatCurrency(intervention.costs.ongoingCostFixed)}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-2 pl-12">One Time Fixed Fee</td>
                      {[0, 1, 2].map((year) => (
                        <td key={year} className="px-6 py-2 text-right">
                          {formatCurrency(intervention.costs.oneTimeFixedFee)}
                        </td>
                      ))}
                    </tr>
                  </>
                )}
              </>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td className="px-6 py-4 font-semibold">Total costs</td>
              {[0, 1, 2].map((year) => (
                <td key={year} className="px-6 py-4 text-right font-semibold">
                  {formatCurrency(
                    interventions.reduce(
                      (total, intervention) => total + calculateTotalCost(intervention.costs),
                      0
                    )
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
} 