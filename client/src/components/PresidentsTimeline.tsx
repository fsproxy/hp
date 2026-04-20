import { useState } from 'react';

interface President {
  name: string;
  start: number;
  end: number;
  period: string;
}

interface PresidentsTimelineProps {
  presidents: President[];
}

export default function PresidentsTimeline({ presidents }: PresidentsTimelineProps) {
  const [selectedEra, setSelectedEra] = useState<string>('all');

  const eras = [
    { id: 'independence', label: 'INDEPENDENCIA (1821-1850)', start: 1821, end: 1850 },
    { id: 'republic', label: 'REPUBLICA (1850-1900)', start: 1850, end: 1900 },
    { id: 'twentieth', label: 'SIGLO XX (1900-2000)', start: 1900, end: 2000 },
    { id: 'contemporary', label: 'CONTEMPORANEO (2000-2026)', start: 2000, end: 2026 },
  ];

  const filteredPresidents =
    selectedEra === 'all'
      ? presidents
      : presidents.filter((p) => {
          const era = eras.find((e) => e.id === selectedEra);
          return era && p.start >= era.start && p.start <= era.end;
        });

  return (
    <section id="presidents" className="bg-white py-12 md:py-16 border-b-2 border-black">
      <div className="container max-w-4xl">
        <h2 className="section-title mb-8">LINEA DE PRESIDENTES</h2>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedEra('all')}
            className={`typewriter-button text-xs px-3 py-1 ${
              selectedEra === 'all' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            TODOS
          </button>
          {eras.map((era) => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`typewriter-button text-xs px-3 py-1 ${
                selectedEra === era.id ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredPresidents.map((president, idx) => (
            <div key={idx} className="typewriter-card">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="font-bold text-sm uppercase tracking-wider">{president.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {president.start} - {president.end}
                  </p>
                </div>
                <div className="inline-block bg-gray-200 text-gray-800 px-2 py-1 text-xs font-bold">
                  {president.period}
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="divider-line mt-8" />

        <div className="typewriter-box mt-6">
          <p className="text-xs font-bold mb-2">LECTURA PRESIDENCIAL:</p>
          <div className="text-xs space-y-1">
            <p>TOTAL DE PRESIDENTES: {presidents.length}</p>
            <p>PERIODO CUBIERTO: 1821 - 2026 (205 anos)</p>
            <p>PROMEDIO DE MANDATO: {(presidents.reduce((acc, p) => acc + (p.end - p.start), 0) / presidents.length).toFixed(1)} anos</p>
            <p>La lista solo muestra el periodo de gobierno y el bloque politico o partido asociado en la fuente de datos.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
