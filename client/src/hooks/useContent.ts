import { useState, useEffect } from 'react';

interface HistoricalPeriod {
  id: string;
  name: string;
  period: string;
  description: string;
  highlights: string[];
}

interface PoliticalParty {
  id: string;
  name: string;
  founded: number;
  founder: string;
  currentLeader?: string;
  ideology: string;
  description: string;
  significance: string;
  contexto: string;
  hechos: string[];
  positivos: string[];
  negativos: string[];
  resumenAnalitico: string;
  tags?: {
    positive?: string[];
    negative?: string[];
    risk?: string[];
    context?: string[];
    scoring?: {
      positive?: string[];
      negative?: string[];
      risk?: string[];
      context?: string[];
    };
  };
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
  tags?: {
    positive?: string[];
    negative?: string[];
    risk?: string[];
    context?: string[];
    scoring?: {
      positive?: string[];
      negative?: string[];
      risk?: string[];
      context?: string[];
    };
  };
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  riskSignals?: string[];
}

interface GovernmentPower {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  structure: string;
  senateFunctions?: string[];
  deputyFunctions?: string[];
  institutions?: string[];
}

interface President {
  name: string;
  start: number;
  end: number;
  period: string;
  tags?: {
    positive?: string[];
    negative?: string[];
    risk?: string[];
    context?: string[];
    scoring?: {
      positive?: string[];
      negative?: string[];
      risk?: string[];
      context?: string[];
    };
  };
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  riskSignals?: string[];
}

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
  tags?: {
    positive?: string[];
    negative?: string[];
    risk?: string[];
    context?: string[];
  };
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  riskSignals?: string[];
}

interface ContentData {
  site: {
    title: string;
    subtitle: string;
    description: string;
  };
  historicalPeriods: HistoricalPeriod[];
  politicalParties: PoliticalParty[];
  politicalLeaders: PoliticalLeader[];
  governmentPowers: GovernmentPower[];
  presidents: President[];
  regionalAnalysis: Region[];
  presidentialAnalysis: PresidentialAnalysis[];
}

export function useContent() {
  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/content.json');
        if (!response.ok) {
          throw new Error('Failed to load content');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback data if file doesn't load
        setData({
          site: {
            title: 'Historia del Perú',
            subtitle: 'Un viaje a través de los siglos',
            description: 'Explora la historia del Perú',
          },
          historicalPeriods: [],
          politicalParties: [],
          politicalLeaders: [],
          governmentPowers: [],
          presidents: [],
          regionalAnalysis: [],
          presidentialAnalysis: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return { data, loading, error };
}
