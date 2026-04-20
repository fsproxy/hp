import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface PoliticalParty {
  id: string;
  name: string;
  founded: number;
  founder: string;
  ideology: string;
  description: string;
  significance: string;
  contexto: string;
  hechos: string[];
  positivos: string[];
  negativos: string[];
  resumenAnalitico: string;
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  riskSignals?: string[];
}

interface PartiesSectionProps {
  parties: PoliticalParty[];
}

export default function PartiesSection({ parties }: PartiesSectionProps) {
  const [selectedIdeology, setSelectedIdeology] = useState<string>('all');

  const uniqueParties = Array.from(new Map(parties.map((p) => [p.id, p])).values());
  const ideologies = Array.from(new Set(uniqueParties.map((p) => p.ideology)));

  const filteredParties =
    selectedIdeology === 'all'
      ? uniqueParties
      : uniqueParties.filter((p) => p.ideology === selectedIdeology);

  const sortedParties = [...filteredParties].sort((a, b) => a.founded - b.founded);

  const getRiskLevel = (party: PoliticalParty) => party.riskLevel || 'BAJO';

  const riskClass = (level: string) => {
    if (level === 'CRITICO') return 'bg-red-900 text-white ring-2 ring-red-400';
    if (level === 'ALTO') return 'bg-red-700 text-white';
    if (level === 'MEDIO') return 'bg-amber-300 text-black';
    return 'bg-gray-200 text-gray-800';
  };

  return (
    <section id="parties" className="bg-white py-12 md:py-16 border-b-2 border-black">
      <div className="container max-w-4xl">
        <h2 className="section-title mb-8">PARTIDOS POLITICOS</h2>

        {/* Ideology Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedIdeology('all')}
            className={`typewriter-button text-xs px-3 py-1 ${
              selectedIdeology === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }`}
          >
            TODOS
          </button>
          {ideologies.map((ideology) => (
            <button
              key={ideology}
              onClick={() => setSelectedIdeology(ideology)}
              className={`typewriter-button text-xs px-3 py-1 ${
                selectedIdeology === ideology
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              }`}
            >
              {ideology.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Parties Grid */}
        <div className="space-y-3">
          {sortedParties.map((party) => (
            <div key={party.id} className="typewriter-card">
              <div className="mb-2">
                <p className="font-bold text-sm uppercase tracking-wider">
                  [{party.name}]
                </p>
                <div className="flex justify-between items-start mt-1">
                  <p className="text-xs text-gray-600">
                    FUNDADO: {party.founded} | FUNDADOR: {party.founder}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block bg-gray-200 text-gray-800 px-2 py-1 text-xs font-bold">
                      {party.ideology}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${riskClass(getRiskLevel(party))}`}>
                      <AlertTriangle size={12} />
                      RIESGO {getRiskLevel(party)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs leading-relaxed mb-2">{party.description}</p>

              <div className="text-xs space-y-2 border-t border-gray-300 pt-2 mt-2">
                <p>
                  <span className="font-bold">CONTEXTO:</span> {party.contexto}
                </p>
                <div>
                  <p className="font-bold mb-1">HECHOS QUE MARCARON:</p>
                  <ul className="typewriter-list text-xs">
                    {party.hechos.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-1">POSITIVOS:</p>
                  <ul className="typewriter-list text-xs">
                    {party.positivos.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-1 text-red-700">NEGATIVOS:</p>
                  <ul className="typewriter-list text-xs">
                    {party.negativos.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-2 border border-gray-300">
                  <p className="font-bold mb-1">RESUMEN ANALITICO:</p>
                  <p className="leading-relaxed">{party.resumenAnalitico}</p>
                </div>
                {party.riskSignals && party.riskSignals.length > 0 && (
                  <div>
                    <p className="font-bold mb-1 text-red-700">SEÑALES DE RIESGO:</p>
                    <ul className="typewriter-list text-xs">
                      {party.riskSignals.map((signal, idx) => (
                        <li key={idx}>{signal}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="font-bold mb-1">SIGNIFICANCIA:</p>
                  <p className="leading-relaxed">{party.significance}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="divider-line mt-8" />

        <div className="typewriter-box mt-6">
          <p className="text-xs font-bold mb-2">INFORMACION SOBRE PARTIDOS:</p>
          <p className="text-xs leading-relaxed">
            Los partidos se presentan aqui en orden historico de fundacion para mostrar la
            evolucion real del sistema politico peruano: primero las corrientes ideologicas, luego
            las maquinarias electorales y finalmente los vehiculos de crisis y polarizacion.
          </p>
          <p className="text-xs leading-relaxed mt-2">
            El simbolo de riesgo resume la probabilidad de radicalizacion, autoritarismo,
            corrupcion, violencia politica o bloqueo institucional asociada a cada partido segun su
            trayectoria historica.
          </p>
        </div>
      </div>
    </section>
  );
}
