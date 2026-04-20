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

interface PresidentialAnalysis {
  name: string;
  period: string;
  party: string;
  ideology: string;
  causes: string;
  positivos: string[];
  negativos: string[];
  impactoRegional: {
    costa: string;
    sierra: string;
    selva: string;
  };
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  riskSignals?: string[];
}

interface PoliticalComparisonProps {
  parties: PoliticalParty[];
  leaders: PoliticalLeader[];
  presidents: PresidentialAnalysis[];
}

type CompareCategory = 'partido' | 'lider' | 'presidente';
type MetricMode = 'bien_comun' | 'riesgo_institucional';

interface CompareItem {
  year: number;
  category: CompareCategory;
  title: string;
  subtitle: string;
  context: string;
  hechos: string[];
  positivos: string[];
  negativos: string[];
  resumen: string;
  period: string;
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  riskSignals?: string[];
}

function parseStartYear(period: string) {
  const match = period.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function parseDuration(period: string) {
  const match = period.match(/(\d{4})(?:\s*-\s*(\d{4}))?/);
  if (!match) return null;
  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : start;
  return end - start;
}

function getInstitutionalRiskLevel(item: {
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  title: string;
  subtitle: string;
  context: string;
  resumen: string;
}) {
  if (item.riskLevel) return item.riskLevel;

  const lower = `${item.title} ${item.subtitle} ${item.context} ${item.resumen}`.toLowerCase();
  if (
    lower.includes('autogolpe') ||
    lower.includes('rebelion') ||
    lower.includes('quiebre constitucional') ||
    lower.includes('ruptura constitucional') ||
    lower.includes('golpe de estado') ||
    lower.includes('terror') ||
    lower.includes('autoritar') ||
    lower.includes('radical') ||
    lower.includes('repres')
  ) {
    return 'CRITICO';
  }

  if (lower.includes('corrup') || lower.includes('censur') || lower.includes('golpe')) {
    return 'ALTO';
  }

  if (
    lower.includes('comunista') ||
    lower.includes('socialismo') ||
    lower.includes('izquierda') ||
    lower.includes('nacionalismo') ||
    lower.includes('populismo') ||
    lower.includes('tecnocracia')
  ) {
    return 'MEDIO';
  }

  return 'BAJO';
}

function getImpactLevel(item: CompareItem) {
  const duration = item.category === 'presidente' ? parseDuration(item.period) : null;
  const text = `${item.title} ${item.subtitle} ${item.context} ${item.resumen} ${item.positivos.join(
    ' '
  )} ${item.negativos.join(' ')}`.toLowerCase();

  let benefit = 0;
  let harm = 0;

  const addIfMatches = (needle: string, score: number, target: 'benefit' | 'harm') => {
    if (text.includes(needle)) {
      if (target === 'benefit') benefit += score;
      else harm += score;
    }
  };

  const benefitRules: Array<[string, number]> = [
    ['control de la inflacion', 4],
    ['estabilizacion economica', 4],
    ['captura de sendero', 5],
    ['captura de abimael', 5],
    ['recuperacion macroeconomica', 3],
    ['agenda anticorrupcion', 2],
    ['reformas politicas', 2],
    ['programas sociales', 2],
    ['bonos', 2],
    ['crecimiento economico', 2],
    ['crecimiento', 1],
    ['infraestructura', 1],
    ['inversion', 1],
    ['modernizacion', 1],
    ['seguridad', 1],
    ['desarrollo', 1],
    ['redistribucion', 1],
    ['representacion', 1],
    ['inclusion', 1],
    ['salud', 1],
    ['educacion', 1],
    ['respuesta inicial de gestion', 1],
  ];

  const harmRules: Array<[string, number]> = [
    ['hiperinflacion', 5],
    ['escasez', 3],
    ['crisis', 2],
    ['corrupcion', 2],
    ['autogolpe', 5],
    ['violencia', 3],
    ['represion', 3],
    ['pobreza', 2],
    ['desigualdad', 2],
    ['polarizacion', 2],
    ['abandono', 2],
    ['inestabilidad', 2],
    ['desempleo', 2],
    ['conflicto', 2],
    ['colapso', 3],
    ['deuda', 2],
    ['quiebre', 5],
    ['rebelion', 4],
    ['violaciones de derechos humanos', 4],
    ['muerte', 2],
    ['caos', 2],
    ['improvisacion', 2],
    ['censur', 1],
  ];

  benefitRules.forEach(([keyword, score]) => addIfMatches(keyword, score, 'benefit'));
  harmRules.forEach(([keyword, score]) => addIfMatches(keyword, score, 'harm'));

  if (item.category === 'presidente') {
    const title = item.title.toLowerCase();
    if (title.includes('manuel merino')) return 'BAJO';
    if (title.includes('pedro castillo')) return 'CRITICO';
    if (title.includes('alan garcia perez (primer gobierno)')) return 'CRITICO';
    if (title.includes('alan garcia perez (segundo gobierno)')) return 'MEDIO';
    if (title.includes('martin vizcarra')) return 'MEDIO';
    if (title.includes('alberto fujimori')) return 'ALTO';

    if (duration !== null && duration <= 1 && benefit + harm <= 4) {
      return 'BAJO';
    }
  }

  if (benefit >= harm + 4) return 'ALTO';
  if (harm >= benefit + 5) return 'CRITICO';
  if (Math.abs(benefit - harm) <= 2) return 'MEDIO';
  if (benefit > harm) return 'ALTO';
  return 'BAJO';
}

function getMetricLevel(item: CompareItem, mode: MetricMode) {
  if (mode === 'riesgo_institucional') {
    return getInstitutionalRiskLevel(item);
  }

  return getImpactLevel(item);
}

function metricClass(level: string, mode: MetricMode) {
  if (mode === 'bien_comun') {
    if (level === 'CRITICO') return 'bg-red-700 text-white';
    if (level === 'ALTO') return 'bg-emerald-700 text-white';
    if (level === 'MEDIO') return 'bg-amber-300 text-black';
    return 'bg-gray-200 text-gray-800';
  }

  if (level === 'CRITICO') return 'bg-red-900 text-white ring-2 ring-red-400';
  if (level === 'ALTO') return 'bg-red-700 text-white';
  if (level === 'MEDIO') return 'bg-amber-300 text-black';
  return 'bg-gray-200 text-gray-800';
}

export default function PoliticalComparison({
  parties,
  leaders,
  presidents,
}: PoliticalComparisonProps) {
  const [selectedCategory, setSelectedCategory] = useState<CompareCategory>('presidente');
  const [metricMode, setMetricMode] = useState<MetricMode>('bien_comun');

  const items: CompareItem[] = [
    ...parties.map((party) => ({
      year: party.founded,
      category: 'partido' as const,
      title: party.name,
      subtitle: `${party.founder} | ${party.ideology}`,
      context: party.contexto,
      hechos: party.hechos,
      positivos: party.positivos,
      negativos: party.negativos,
      resumen: party.resumenAnalitico,
      period: `${party.founded}`,
      riskLevel: party.riskLevel,
      riskSignals: party.riskSignals,
    })),
    ...leaders.map((leader) => ({
      year: leader.birthYear,
      category: 'lider' as const,
      title: leader.name,
      subtitle: `${leader.role} | ${leader.party}`,
      context: leader.contexto,
      hechos: leader.hechos,
      positivos: leader.positivos,
      negativos: leader.negativos,
      resumen: leader.resumenAnalitico,
      period: `${leader.birthYear}${leader.deathYear ? ` - ${leader.deathYear}` : ''}`,
      riskLevel: leader.riskLevel,
      riskSignals: leader.riskSignals,
    })),
    ...presidents.map((president) => {
      const year = parseStartYear(president.period);
      return {
        year,
        category: 'presidente' as const,
        title: president.name,
        subtitle: `${president.period} | ${president.party} | ${president.ideology}`,
        context: president.causes,
        hechos: [`Periodo presidencial: ${president.period}`],
        positivos: president.positivos,
        negativos: president.negativos,
        resumen:
          'Gobierno definido por una mezcla de promesas de cambio, tensiones de poder y un costo institucional que se sintio de forma desigual en las regiones.',
        period: president.period,
        riskLevel: president.riskLevel,
        riskSignals: president.riskSignals,
      };
    }),
  ].sort((a, b) => a.year - b.year);

  const filteredItems = items.filter((item) => item.category === selectedCategory);

  const categoryLabel: Record<CompareCategory, string> = {
    partido: 'PARTIDO',
    lider: 'LIDER',
    presidente: 'PRESIDENTE',
  };

  const badgeClass: Record<CompareCategory, string> = {
    partido: 'bg-gray-200 text-gray-800',
    lider: 'bg-black text-white',
    presidente: 'bg-red-700 text-white',
  };

  const metricLabel = metricMode === 'bien_comun' ? 'IMPACTO' : 'RIESGO';

  return (
    <section id="comparison" className="bg-white py-12 md:py-16 border-b-2 border-black">
      <div className="container max-w-5xl">
        <h2 className="section-title mb-8">BALANCE HISTORICO</h2>

        <div className="mb-6 typewriter-box">
          <p className="text-xs font-bold mb-2">MEDIDORES:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMetricMode('bien_comun')}
              className={`typewriter-button text-xs px-3 py-1 ${
                metricMode === 'bien_comun' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              IMPACTO EN BIEN COMUN
            </button>
            <button
              onClick={() => setMetricMode('riesgo_institucional')}
              className={`typewriter-button text-xs px-3 py-1 ${
                metricMode === 'riesgo_institucional' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              RIESGO INSTITUCIONAL
            </button>
          </div>
          <p className="text-xs leading-relaxed mt-2">
            El primer medidor prioriza bienestar, estabilidad y resultados generales para la poblacion. El segundo mide el peligro para la institucionalidad, la democracia y el orden constitucional.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: 'presidente', label: 'PRESIDENTES' },
            { id: 'partido', label: 'PARTIDOS' },
            { id: 'lider', label: 'LIDERES' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedCategory(option.id as CompareCategory)}
              className={`typewriter-button text-xs px-3 py-1 ${
                selectedCategory === option.id ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div key={`${item.category}-${item.title}-${item.year}`} className="typewriter-card">
              <div className="flex flex-wrap gap-2 items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-sm uppercase tracking-wider">[{item.title}]</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.year} | {item.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-1 text-xs font-bold ${badgeClass[item.category]}`}>
                    {categoryLabel[item.category]}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${metricClass(
                      getMetricLevel(item, metricMode),
                      metricMode
                    )}`}
                  >
                    <AlertTriangle size={12} />
                    {metricLabel} {getMetricLevel(item, metricMode)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-300 text-xs space-y-3">
                <div>
                  <p className="font-bold mb-1">CONTEXTO:</p>
                  <p className="leading-relaxed">{item.context}</p>
                </div>
                <div>
                  <p className="font-bold mb-1">HECHOS QUE MARCARON:</p>
                  <ul className="typewriter-list">
                    {item.hechos.map((hecho, idx) => (
                      <li key={idx}>{hecho}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-1">POSITIVOS:</p>
                  <ul className="typewriter-list">
                    {item.positivos.map((pos, idx) => (
                      <li key={idx}>{pos}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-1 text-red-700">NEGATIVOS:</p>
                  <ul className="typewriter-list">
                    {item.negativos.map((neg, idx) => (
                      <li key={idx}>{neg}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-2 border border-gray-300">
                  <p className="font-bold mb-1">RESUMEN ANALITICO:</p>
                  <p className="leading-relaxed">{item.resumen}</p>
                </div>
                {item.riskSignals && item.riskSignals.length > 0 && (
                  <div>
                    <p className="font-bold mb-1 text-red-700">SENALES DE RIESGO:</p>
                    <ul className="typewriter-list">
                      {item.riskSignals.map((signal, idx) => (
                        <li key={idx}>{signal}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <hr className="divider-line mt-8" />

        <div className="typewriter-box mt-6">
          <p className="text-xs font-bold mb-2">LECTURA COMPARATIVA:</p>
          <p className="text-xs leading-relaxed">
            Esta vista junta partidos, lideres y presidencias en una sola secuencia historica para
            mostrar como el Peru paso de caudillos y partidos doctrinarios a maquinas electorales,
            liderazgos radicales y gobiernos debilitados por la polarizacion. El resultado es un
            panorama donde la continuidad institucional ha sido la excepcion, no la regla.
          </p>
          <p className="text-xs leading-relaxed mt-2">
            El primer medidor resume el impacto sobre el bien comun y el segundo resume el riesgo
            institucional. CRITICO se reserva para quiebre constitucional o violencia politica
            grave. No sustituye una investigacion judicial, pero ayuda a leer rapidamente los focos
            de mayor peligro politico.
          </p>
        </div>
      </div>
    </section>
  );
}
