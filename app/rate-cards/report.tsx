
'use client';

import { useEffect, useState } from 'react';

const mockClients = ['AUSFB Bank', 'ABC Corp', 'Xyz Fintech'];
const uploadedRateCards = ['AUSFB Bank']; // This would normally be fetched

export default function RateCardReport() {
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    const missingClients = mockClients.filter(c => !uploadedRateCards.includes(c));
    setMissing(missingClients);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rate Card Coverage Report</h1>
      <div className="space-y-3">
        {mockClients.map(client => (
          <div
            key={client}
            className={`p-3 border rounded ${
              missing.includes(client) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {client} — {missing.includes(client) ? '❌ Missing Rate Card' : '✅ Rate Card Available'}
          </div>
        ))}
      </div>
    </div>
  );
}
