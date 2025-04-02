'use client';

import { useState, useEffect } from 'react';
import { format, addMonths } from 'date-fns';
import BudgetGauges from '@/components/BudgetGauges';
import GanttChart from '@/components/GanttChart';
import CostTable from '@/components/CostTable';
import InterventionEditModal from '@/components/InterventionEditModal';
import { Intervention, YearlyBudget } from '@/types/interventions';
import { calculateTotalYearlyCosts, getYearEndDate } from '@/utils/costCalculations';

// Test interventions for demonstration
const testInterventions: Intervention[] = [
  {
    id: 1,
    name: "Mental Health Platform",
    description: "24/7 access to mental health professionals",
    timeline: {
      implementationStartDate: new Date(2025, 7, 1), // August 1, 2025
      implementationEndDate: new Date(2025, 9, 31), // October 31, 2025
      ongoingStartDate: new Date(2025, 8, 1), // September 1, 2025
      ongoingEndDate: new Date(2027, 2, 12), // March 12, 2027
    },
    costs: {
      implementationCost: 120000,
      ongoingCostPEPM: 2.45,
      ongoingCostFixed: 10000,
      oneTimeFixedFee: 1500,
    },
    eligibleEmployees: 500,
  },
  {
    id: 2,
    name: "Physical Wellness Program",
    description: "Comprehensive wellness program for employees",
    timeline: {
      implementationStartDate: new Date(2026, 3, 1), // April 1, 2026
      implementationEndDate: new Date(2026, 4, 31), // May 31, 2026
      ongoingStartDate: new Date(2026, 5, 1), // June 1, 2026
      ongoingEndDate: new Date(2028, 2, 12), // March 12, 2028
    },
    costs: {
      implementationCost: 0,
      ongoingCostPEPM: 3.33,
      ongoingCostFixed: 0,
      oneTimeFixedFee: 10000,
    },
    eligibleEmployees: 500,
  }
];

export default function RoadmapPage() {
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 2, 13)); // March 13, 2025
  const [yearlyBudget, setYearlyBudget] = useState<number>(500000);
  const [selectedInterventions, setSelectedInterventions] = useState<Intervention[]>(testInterventions);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
  const [yearlyBudgets, setYearlyBudgets] = useState<YearlyBudget[]>([
    { allocated: yearlyBudget, spent: 0, isOverBudget: false },
    { allocated: yearlyBudget, spent: 0, isOverBudget: false },
    { allocated: yearlyBudget, spent: 0, isOverBudget: false }
  ]);

  const handleEditIntervention = (intervention: Intervention) => {
    setEditingIntervention(intervention);
  };

  const handleSaveIntervention = (updatedIntervention: Intervention) => {
    setSelectedInterventions(
      selectedInterventions.map((intervention) =>
        intervention.id === updatedIntervention.id ? updatedIntervention : intervention
      )
    );
    setEditingIntervention(null);
  };

  // Update yearly budgets when interventions or budget changes
  useEffect(() => {
    const newYearlyBudgets = [0, 1, 2].map((index) => {
      const yearStart = addMonths(startDate, index * 12);
      const yearEnd = getYearEndDate(yearStart);
      const spent = calculateTotalYearlyCosts(selectedInterventions, yearStart, yearEnd, startDate);
      return {
        allocated: yearlyBudget,
        spent,
        isOverBudget: spent > yearlyBudget
      };
    });
    setYearlyBudgets(newYearlyBudgets);
  }, [yearlyBudget, selectedInterventions, startDate]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-t-lg">
          <h1 className="text-3xl font-bold">Strategic roadmap</h1>
          <p className="mt-4">
            It is tempting to try to do everything in one year - however, health and well-being is not a &quot;one and done&quot; activity. It is a journey, with each year building upon the next.
          </p>
          <p className="mt-2">
            Pace yourself! Ongoing efforts will be needed to sustain health and wellbeing within your organisation.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-b-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Multi-year roadmap</h2>
            <div className="flex gap-8">
              <div>
                <label className="block text-sm text-gray-600">Yearly investment</label>
                <input
                  type="number"
                  value={yearlyBudget}
                  onChange={(e) => setYearlyBudget(Number(e.target.value))}
                  className="mt-1 block w-40 rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Roadmap start date</label>
                <input
                  type="date"
                  value={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="mt-1 block w-40 rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          <BudgetGauges startDate={startDate} yearlyBudgets={yearlyBudgets} />
          
          <GanttChart
            startDate={startDate}
            interventions={selectedInterventions}
            onEdit={handleEditIntervention}
          />
          
          <CostTable startDate={startDate} interventions={selectedInterventions} />
        </div>
      </div>

      {editingIntervention && (
        <InterventionEditModal
          intervention={editingIntervention}
          onClose={() => setEditingIntervention(null)}
          onSave={handleSaveIntervention}
        />
      )}
    </main>
  );
} 