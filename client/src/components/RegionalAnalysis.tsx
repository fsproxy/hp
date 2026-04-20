import { useState } from 'react';

interface Region {
  id: string;
  name: string;
  geography: string;
  population: string;
  majorCities: string[];
  economy: string;
  characteristics: string[];
  politicalInfluence: string;
  culturalIdentity: string;
  socialComposition: string;
  electoralBehavior: string;
}

interface RegionalAnalysisProps {
  regions: Region[];
}

export default function RegionalAnalysis({ regions }: RegionalAnalysisProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0]?.id || 'costa');

  const currentRegion = regions.find((r) => r.id === selectedRegion);

  if (!currentRegion) return null;

  return (
    <section id="regions" className="bg-white py-12 md:py-16 border-b-2 border-black">
      <div className="container max-w-4xl">
        <h2 className="section-title mb-8">ANALISIS REGIONAL</h2>

        {/* Region Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`typewriter-button text-xs px-3 py-1 ${
                selectedRegion === region.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              }`}
            >
              {region.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Region Details */}
        <div className="typewriter-box">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-3">
            [{currentRegion.name}]
          </h3>

          <div className="text-xs space-y-3">
            <div>
              <p className="font-bold mb-1">GEOGRAFIA:</p>
              <p className="leading-relaxed">{currentRegion.geography}</p>
            </div>

            <div>
              <p className="font-bold mb-1">POBLACION:</p>
              <p>{currentRegion.population}</p>
            </div>

            <div>
              <p className="font-bold mb-1">CIUDADES PRINCIPALES:</p>
              <p>{currentRegion.majorCities.join(', ')}</p>
            </div>

            <div>
              <p className="font-bold mb-1">ECONOMIA:</p>
              <p className="leading-relaxed">{currentRegion.economy}</p>
            </div>

            <div>
              <p className="font-bold mb-1">CARACTERISTICAS:</p>
              <ul className="typewriter-list text-xs">
                {currentRegion.characteristics.map((char, idx) => (
                  <li key={idx}>{char}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-bold mb-1">IDENTIDAD CULTURAL:</p>
              <p className="leading-relaxed">{currentRegion.culturalIdentity}</p>
            </div>

            <div>
              <p className="font-bold mb-1">COMPOSICION SOCIAL:</p>
              <p className="leading-relaxed">{currentRegion.socialComposition}</p>
            </div>

            <div>
              <p className="font-bold mb-1">INFLUENCIA POLITICA:</p>
              <p className="leading-relaxed">{currentRegion.politicalInfluence}</p>
            </div>

            <div>
              <p className="font-bold mb-1">COMPORTAMIENTO ELECTORAL:</p>
              <p className="leading-relaxed">{currentRegion.electoralBehavior}</p>
            </div>
          </div>
        </div>

        <hr className="divider-line mt-8" />

        <div className="typewriter-box mt-6">
          <p className="text-xs font-bold mb-2">NOTA SOBRE REGIONES:</p>
          <p className="text-xs leading-relaxed">
            Las tres regiones del Peru (Costa, Sierra y Selva) presentan diferencias significativas en geografia, economia, cultura e identidad politica. Estas diferencias han moldeado la historia politica del pais y continuan siendo factores determinantes en los resultados electorales y las politicas publicas.
          </p>
        </div>
      </div>
    </section>
  );
}
