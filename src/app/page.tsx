'use client';

import { useState } from 'react';

interface Intervention {
  id: number;
  name: string;
  description: string;
}

const interventions: Intervention[] = [
  { id: 1, name: "Mental Health Support", description: "24/7 access to mental health professionals" },
  { id: 2, name: "Fitness Program", description: "Access to gym memberships and virtual fitness classes" },
  { id: 3, name: "Telemedicine", description: "Virtual doctor consultations" },
  { id: 4, name: "Dental Coverage", description: "Comprehensive dental care" },
  { id: 5, name: "Vision Care", description: "Eye examinations and eyewear coverage" },
  // Adding more interventions to reach 20
  { id: 6, name: "Nutrition Counseling", description: "Professional dietary guidance" },
  { id: 7, name: "Physical Therapy", description: "Rehabilitation services" },
  { id: 8, name: "Wellness Programs", description: "Stress management and wellness workshops" },
  { id: 9, name: "Prescription Coverage", description: "Medication cost coverage" },
  { id: 10, name: "Preventive Care", description: "Regular health screenings" },
  { id: 11, name: "Alternative Medicine", description: "Acupuncture and chiropractic care" },
  { id: 12, name: "Maternity Support", description: "Pregnancy and postpartum care" },
  { id: 13, name: "Sleep Health", description: "Sleep disorder treatments and consultations" },
  { id: 14, name: "Chronic Disease Management", description: "Ongoing support for chronic conditions" },
  { id: 15, name: "Emergency Care", description: "24/7 emergency medical services" },
  { id: 16, name: "Health Coaching", description: "Personal health and wellness coaching" },
  { id: 17, name: "Smoking Cessation", description: "Support to quit smoking" },
  { id: 18, name: "Weight Management", description: "Personalized weight loss programs" },
  { id: 19, name: "Substance Abuse Support", description: "Addiction recovery services" },
  { id: 20, name: "Work-Life Balance", description: "Stress management and counseling" }
];

export default function Home() {
  const [selectedInterventions, setSelectedInterventions] = useState<number[]>([]);

  const toggleIntervention = (id: number) => {
    setSelectedInterventions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSave = () => {
    console.log('Selected interventions:', selectedInterventions);
    alert(`Saved ${selectedInterventions.length} interventions!`);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Healthcare Benefits Selection</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interventions.map((intervention) => (
            <div
              key={intervention.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedInterventions.includes(intervention.id)
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => toggleIntervention(intervention.id)}
            >
              <h3 className="font-semibold">{intervention.name}</h3>
              <p className="text-sm text-gray-600">{intervention.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Selected Benefits ({selectedInterventions.length})
          </button>
        </div>
      </div>
    </main>
  );
}
