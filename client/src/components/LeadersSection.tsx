import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface PoliticalLeader {
  id: string;
  name: string;
  party: string;
  birthYear: number;
  deathYear: number | null;
  birthPlace: string;
  role: string;
  biography: string;
  achievements: string[];
  contexto: string;
  hechos: string[];
  positivos: string[];
  negativos: string[];
  resumenAnalitico: string;
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  riskSignals?: string[];
}

interface LeadersSectionProps {
  leaders: PoliticalLeader[];
}

export default function LeadersSection({ leaders }: LeadersSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedParty, setSelectedParty] = useState<string>('all');

  const uniqueLeaders = Array.from(new Map(leaders.map((l) => [l.id, l])).values());
  const parties = Array.from(new Set(uniqueLeaders.map((l) => l.party)));

  const filteredLeaders =
    selectedParty === 'all'
      ? uniqueLeaders
      : uniqueLeaders.filter((l) => l.party === selectedParty);

  const sortedLeaders = [...filteredLeaders].sort((a, b) => a.birthYear - b.birthYear);

  const getRiskLevel = (leader: PoliticalLeader) => leader.riskLevel || 'BAJO';

  const riskClass = (level: string) => {
    if (level === 'CRITICO') return 'bg-red-900 text-white ring-2 ring-red-400';
    if (level === 'ALTO') return 'bg-red-700 text-white';
    if (level === 'MEDIO') return 'bg-amber-300 text-black';
    return 'bg-gray-200 text-gray-800';
  };

  return (
    <section id="leaders" className="bg-white py-12 md:py-16 border-b-2 border-black">
      <div className="container max-w-4xl">
        <h2 className="section-title mb-8">LIDERES POLITICOS</h2>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedParty('all')}
            className={`typewriter-button text-xs px-3 py-1 ${
              selectedParty === 'all' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            TODOS
          </button>
          {parties.map((party) => (
            <button
              key={party}
              onClick={() => setSelectedParty(party)}
              className={`typewriter-button text-xs px-3 py-1 ${
                selectedParty === party ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {party.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {sortedLeaders.map((leader) => (
            <div key={leader.id} className="typewriter-card">
              <button
                onClick={() => setExpandedId(expandedId === leader.id ? null : leader.id)}
                className="w-full text-left flex items-center justify-between hover:bg-gray-50 p-2 -m-2"
              >
                <div className="flex-1">
                  <p className="font-bold text-sm uppercase tracking-wider">[{leader.name}]</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {leader.role} | {leader.party} | {leader.birthYear}
                    {leader.deathYear ? ` - ${leader.deathYear}` : ' - PRESENTE'}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${riskClass(getRiskLevel(leader))}`}>
                      <AlertTriangle size={12} />
                      RIESGO {getRiskLevel(leader)}
                    </span>
                  {expandedId === leader.id ? (
                    <ChevronUp size={16} className="flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="flex-shrink-0" />
                  )}
                </div>
              </button>

              {expandedId === leader.id && (
                <div className="mt-3 pt-3 border-t border-gray-300 space-y-3">
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-bold">LUGAR DE NACIMIENTO:</span> {leader.birthPlace}
                    </p>
                    <p>
                      <span className="font-bold">PERIODO VITAL:</span> {leader.birthYear}
                      {leader.deathYear ? ` - ${leader.deathYear}` : ' - PRESENTE'}
                    </p>
                    <p>
                      <span className="font-bold">CONTEXTO HISTORICO:</span> {leader.contexto}
                    </p>
                  </div>

                  <div className="text-xs leading-relaxed">
                    <p className="font-bold mb-1">RESUMEN DE BASE:</p>
                    <p>{leader.biography}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold mb-1">HECHOS QUE MARCARON:</p>
                    <ul className="typewriter-list text-xs">
                      {leader.hechos.map((hecho, idx) => (
                        <li key={idx}>{hecho}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-bold mb-1">POSITIVOS:</p>
                    <ul className="typewriter-list text-xs">
                      {leader.positivos.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-bold mb-1 text-red-700">NEGATIVOS:</p>
                    <ul className="typewriter-list text-xs">
                      {leader.negativos.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-2 border border-gray-300">
                    <p className="text-xs font-bold mb-1">RESUMEN ANALITICO:</p>
                    <p className="text-xs leading-relaxed">{leader.resumenAnalitico}</p>
                  </div>

                  {leader.riskSignals && leader.riskSignals.length > 0 && (
                    <div>
                      <p className="text-xs font-bold mb-1 text-red-700">SEÑALES DE RIESGO:</p>
                      <ul className="typewriter-list text-xs">
                        {leader.riskSignals.map((signal, idx) => (
                          <li key={idx}>{signal}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-bold mb-1">REFERENCIA HISTORICA:</p>
                    <ul className="typewriter-list text-xs">
                      {leader.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
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
          <p className="text-xs font-bold mb-2">NOTA SOBRE LIDERES:</p>
          <p className="text-xs leading-relaxed">
            Los lideres politicos peruanos se presentan en orden historico para mostrar como cada
            epoca produjo liderazgos distintos: caudillismo, reforma, autoritarismo, tecnocracia
            y populismo. El enfoque es critico y regional, con atencion a los hechos que marcaron,
            los costos politicos y las consecuencias sobre el pais.
          </p>
          <p className="text-xs leading-relaxed mt-2">
            Los niveles de riesgo destacan liderazgos con mayor capacidad de desestabilizacion
            institucional, violencia politica, radicalizacion o captura partidaria.
          </p>
        </div>
      </div>
    </section>
  );
}
