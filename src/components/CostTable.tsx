import React, { useState } from 'react';
import { format, addYears } from 'date-fns';
import { Intervention } from '@/types/interventions';
import { calculateYearlyCosts } from '@/utils/costCalculations';

interface CostTableProps {
  startDate: Date;
  interventions: Intervention[];
}

export default function CostTable({ startDate, interventions }: CostTableProps) {
  const [expandedInterventions, setExpandedInterventions] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedInterventions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get year label based on startDate
  const getYearLabel = (yearIndex: number) => {
    const yearStart = addYears(startDate, yearIndex);
    const yearEnd = addYears(yearStart, 1);
    yearEnd.setDate(yearEnd.getDate() - 1);
    
    return `${format(yearStart, 'dd/MM/yyyy')} - ${format(yearEnd, 'dd/MM/yyyy')}`;
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Investment Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intervention
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost Type
              </th>
              {[0, 1, 2].map((year) => (
                <th
                  key={year}
                  className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {getYearLabel(year)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interventions.map((intervention) => {
              const yearCosts = [0, 1, 2].map(year => {
                const yearStart = addYears(startDate, year);
                const yearEnd = addYears(yearStart, 1);
                return calculateYearlyCosts(intervention, yearStart, yearEnd, startDate);
              });
              
              const totalCosts = yearCosts.map(y => y.total);
              const isExpanded = expandedInterventions.includes(intervention.id);
              
              return (
                <React.Fragment key={intervention.id}>
                  {/* Main row showing total cost */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleExpand(intervention.id)}
                          className="text-blue-500 hover:text-blue-600 focus:outline-none"
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                        <span className="ml-2 font-medium">{intervention.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      Total Cost
                    </td>
                    {totalCosts.map((cost, idx) => (
                      <td key={idx} className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        {formatCurrency(cost)}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Expanded rows showing cost breakdown */}
                  {isExpanded && (
                    <>
                      {/* Implementation Cost */}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-2"></td>
                        <td className="px-6 py-2">Implementation Cost (fixed)</td>
                        {yearCosts.map((yearCost, idx) => (
                          <td key={idx} className="px-6 py-2 text-right">
                            {yearCost.implementationCost > 0 ? formatCurrency(yearCost.implementationCost) : ""}
                          </td>
                        ))}
                      </tr>
                      
                      {/* Ongoing Cost PEPM */}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-2"></td>
                        <td className="px-6 py-2">Ongoing Cost (PEPM)</td>
                        {yearCosts.map((yearCost, idx) => (
                          <td key={idx} className="px-6 py-2 text-right">
                            {yearCost.pepmCost > 0 ? formatCurrency(yearCost.pepmCost) : ""}
                          </td>
                        ))}
                      </tr>
                      
                      {/* Ongoing Cost Fixed Annual */}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-2"></td>
                        <td className="px-6 py-2">Ongoing Cost (fixed annual)</td>
                        {yearCosts.map((yearCost, idx) => (
                          <td key={idx} className="px-6 py-2 text-right">
                            {yearCost.fixedAnnualCost > 0 ? formatCurrency(yearCost.fixedAnnualCost) : ""}
                          </td>
                        ))}
                      </tr>
                      
                      {/* One Time Fixed Fee */}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-2"></td>
                        <td className="px-6 py-2">One Time Fixed Fee</td>
                        {yearCosts.map((yearCost, idx) => (
                          <td key={idx} className="px-6 py-2 text-right">
                            {yearCost.oneTimeFixedFee > 0 ? formatCurrency(yearCost.oneTimeFixedFee) : ""}
                          </td>
                        ))}
                      </tr>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td className="px-6 py-4 font-semibold" colSpan={2}>Total costs</td>
              {[0, 1, 2].map((year) => {
                const yearStart = addYears(startDate, year);
                const yearEnd = addYears(yearStart, 1);
                let yearTotal = 0;
                
                interventions.forEach(intervention => {
                  const costs = calculateYearlyCosts(intervention, yearStart, yearEnd, startDate);
                  yearTotal += costs.total;
                });
                
                return (
                  <td key={year} className="px-6 py-4 text-right font-semibold">
                    {formatCurrency(yearTotal)}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
} 