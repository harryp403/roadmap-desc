import { useState } from 'react';
import { format } from 'date-fns';
import { Intervention } from '@/types/interventions';

interface InterventionEditModalProps {
  intervention: Intervention | null;
  onClose: () => void;
  onSave: (intervention: Intervention) => void;
}

export default function InterventionEditModal({
  intervention,
  onClose,
  onSave,
}: InterventionEditModalProps) {
  const [editedIntervention, setEditedIntervention] = useState<Intervention | null>(intervention);

  if (!intervention || !editedIntervention) return null;

  const handleSave = () => {
    if (editedIntervention) {
      onSave(editedIntervention);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Edit {intervention.name}</h2>
        
        <div className="space-y-6">
          {/* Timeline Section */}
          <div>
            <h3 className="font-medium mb-2">Implementation Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  value={format(editedIntervention.timeline.implementationStartDate, 'yyyy-MM-dd')}
                  onChange={(e) =>
                    setEditedIntervention({
                      ...editedIntervention,
                      timeline: {
                        ...editedIntervention.timeline,
                        implementationStartDate: new Date(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  value={format(editedIntervention.timeline.implementationEndDate, 'yyyy-MM-dd')}
                  onChange={(e) =>
                    setEditedIntervention({
                      ...editedIntervention,
                      timeline: {
                        ...editedIntervention.timeline,
                        implementationEndDate: new Date(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Ongoing Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  value={format(editedIntervention.timeline.ongoingStartDate, 'yyyy-MM-dd')}
                  onChange={(e) =>
                    setEditedIntervention({
                      ...editedIntervention,
                      timeline: {
                        ...editedIntervention.timeline,
                        ongoingStartDate: new Date(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  value={format(editedIntervention.timeline.ongoingEndDate, 'yyyy-MM-dd')}
                  onChange={(e) =>
                    setEditedIntervention({
                      ...editedIntervention,
                      timeline: {
                        ...editedIntervention.timeline,
                        ongoingEndDate: new Date(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Costs Section */}
          <div>
            <h3 className="font-medium mb-2">Costs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Implementation Cost (Fixed)</label>
                <input
                  type="number"
                  value={editedIntervention.costs.implementationCost}
                  onChange={(e) =>
                    setEditedIntervention({
                      ...editedIntervention,
                      costs: {
                        ...editedIntervention.costs,
                        implementationCost: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Ongoing Cost (PEPM)</label>
                <input
                  type="number"
                  value={editedIntervention.costs.ongoingCostPEPM}
                  onChange={(e) =>
                    setEditedIntervention({
                      ...editedIntervention,
                      costs: {
                        ...editedIntervention.costs,
                        ongoingCostPEPM: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Ongoing Cost (Fixed Annual)</label>
                <input
                  type="number"
                  value={editedIntervention.costs.ongoingCostFixed}
                  onChange={(e) =>
                    setEditedIntervention({
                      ...editedIntervention,
                      costs: {
                        ...editedIntervention.costs,
                        ongoingCostFixed: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">One Time Fixed Fee</label>
                <input
                  type="number"
                  value={editedIntervention.costs.oneTimeFixedFee}
                  onChange={(e) =>
                    setEditedIntervention({
                      ...editedIntervention,
                      costs: {
                        ...editedIntervention.costs,
                        oneTimeFixedFee: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Eligible Employees */}
          <div>
            <label className="block text-sm text-gray-600">Number of Eligible Employees</label>
            <input
              type="number"
              value={editedIntervention.eligibleEmployees || 0}
              onChange={(e) =>
                setEditedIntervention({
                  ...editedIntervention,
                  eligibleEmployees: Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 