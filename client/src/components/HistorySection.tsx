import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface HistoricalPeriod {
  id: string;
  name: string;
  period: string;
  description: string;
  highlights: string[];
}

interface HistorySectionProps {
  periods: HistoricalPeriod[];
}

export default function HistorySection({ periods }: HistorySectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="history" className="bg-white py-12 md:py-16 border-b-2 border-black">
      <div className="container max-w-4xl">
        <h2 className="section-title mb-8">PERIODOS HISTORICOS</h2>

        <div className="space-y-3">
          {periods.map((period) => (
            <div key={period.id} className="typewriter-card">
              <button
                onClick={() => setExpandedId(expandedId === period.id ? null : period.id)}
                className="w-full text-left flex items-center justify-between hover:bg-gray-50 p-2 -m-2"
              >
                <div className="flex-1">
                  <p className="font-bold text-sm uppercase tracking-wider">
                    [{period.name}]
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{period.period}</p>
                </div>
                {expandedId === period.id ? (
                  <ChevronUp size={16} className="flex-shrink-0 ml-2" />
                ) : (
                  <ChevronDown size={16} className="flex-shrink-0 ml-2" />
                )}
              </button>

              {expandedId === period.id && (
                <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                  <p className="text-xs leading-relaxed">{period.description}</p>
                  <div className="mt-2">
                    <p className="text-xs font-bold mb-1">PUNTOS CLAVE:</p>
                    <ul className="typewriter-list text-xs">
                      {period.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <hr className="divider-line mt-8" />

        <div className="typewriter-box mt-6">
          <p className="text-xs font-bold mb-2">NOTA HISTORICA:</p>
          <p className="text-xs leading-relaxed">
            La historia del Peru abarca mas de 10,000 anos de desarrollo humano. Desde las primeras civilizaciones andinas hasta el imperio inca, y posteriormente la conquista espanola y la formacion de la republica moderna. Cada periodo ha dejado su huella en la identidad cultural y politica del pais.
          </p>
        </div>
      </div>
    </section>
  );
}
