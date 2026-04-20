import { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

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
  tags?: TagSet;
  scoringExclusions?: string[];
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
  tags?: TagSet;
  scoringExclusions?: string[];
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
  tags?: TagSet;
  scoringExclusions?: string[];
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
type BalanceLevel = 'MUY_FAVORABLE' | 'FAVORABLE' | 'NEUTRO' | 'ALTO' | 'CRITICO';
type RegionKey = 'costa' | 'sierra' | 'selva';

interface TagSet {
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
}

interface SourceEntry {
  label: string;
  url?: string;
}

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
  tags?: TagSet;
  scoringExclusions?: string[];
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  riskSignals?: string[];
  regions: RegionKey[];
  sources: SourceEntry[];
}

interface ScoreDetail {
  level: BalanceLevel;
  score: number;
  formula: string;
  explanation: string;
  matches: Array<{ label: string; score: number; kind: 'beneficio' | 'daño' }>;
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

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function joinScoringTags(tags: TagSet | undefined) {
  const scoring = tags?.scoring ?? tags;
  return normalizeText(
    [...(scoring?.positive ?? []), ...(scoring?.negative ?? []), ...(scoring?.risk ?? [])].join(' ')
  );
}

function joinRiskTags(tags: TagSet | undefined) {
  return normalizeText([...(tags?.risk ?? []), ...(tags?.context ?? [])].join(' '));
}

function normalizeLookupText(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesWholeTerm(text: string, keyword: string) {
  const normalizedText = ` ${normalizeLookupText(text)} `;
  const normalizedKeyword = normalizeLookupText(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  if (normalizedKeyword === 'censur') {
    return normalizedText.includes(` ${normalizedKeyword} `);
  }

  const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(^|\\s)${escaped}(\\s|$)`);
  return pattern.test(normalizedText);
}

function getStructuredTags(item: CompareItem) {
  return item.tags ?? {
    positive: item.positivos,
    negative: item.negativos,
    risk: item.riskSignals ?? [],
    context: [item.context],
  };
}

function getScoringExclusions(item: CompareItem) {
  return new Set((item.scoringExclusions ?? []).map(normalizeText));
}

function inferRegions(text: string) {
  const lower = text.toLowerCase();
  const regions: RegionKey[] = [];

  const hasAny = (...terms: string[]) => terms.some((term) => lower.includes(term));

  if (hasAny('costa', 'lima', 'callao', 'piura', 'trujillo', 'chiclayo', 'arequipa', 'arequipa', 'urbano', 'costero')) {
    regions.push('costa');
  }

  if (
    hasAny(
      'sierra',
      'andina',
      'andino',
      'cajamarca',
      'cusco',
      'huancayo',
      'ayacucho',
      'puno',
      'junin',
      'moquegua',
      'huancavelica',
      'apurimac',
      'rural'
    )
  ) {
    regions.push('sierra');
  }

  if (hasAny('selva', 'amazon', 'amazonia', 'bagua', 'ucayali', 'loreto', 'madre de dios', 'san martin')) {
    regions.push('selva');
  }

  return regions;
}

const IMPACT_BENEFIT_RULES: Array<[string, number]> = [
  ['control de la inflacion', 4],
  ['frenar la hiperinflacion', 4],
  ['hiperinflacion heredada', 0],
  ['estabilizacion economica', 4],
  ['captura de sendero', 5],
  ['captura de abimael', 5],
  ['debilito a sendero luminoso', 5],
  ['golpe fuerte contra sendero luminoso', 5],
  ['recuperacion macroeconomica', 3],
  ['ordenar la macroeconomia', 3],
  ['restablecio la legalidad', 4],
  ['transicion limpia', 4],
  ['elecciones competitivas', 3],
  ['legitimidad institucional', 3],
  ['transicion democratica', 3],
  ['restaurar legitimidad', 3],
  ['reabrio el camino', 2],
  ['transicion institucional', 2],
  ['reformas politicas', 2],
  ['programas sociales', 2],
  ['bonos', 2],
  ['crecimiento economico', 2],
  ['crecimiento', 1],
  ['infraestructura', 1],
  ['inversion', 1],
  ['modernizacion', 1],
  ['seguridad ciudadana', 3],
  ['seguridad', 1],
  ['reduccion de homicidios', 4],
  ['reduccion de extorsion', 4],
  ['reduccion de sicariato', 4],
  ['desarrollo', 1],
  ['redistribucion', 1],
  ['representacion', 1],
  ['inclusion', 1],
  ['salud publica', 1],
  ['educacion', 1],
  ['respuesta inicial de gestion', 1],
  ['mantenimiento de la estabilidad', 2],
  ['estabilidad macroeconomica', 3],
  ['reduccion de pobreza', 2],
];

const IMPACT_HARM_RULES: Array<[string, number]> = [
  ['hiperinflacion', 5],
  ['escasez', 3],
  ['corrupcion', 3],
  ['investigacion preliminar por corrupcion', 1],
  ['investigacion por corrupcion', 1],
  ['investigaciones por corrupcion', 1],
  ['juicio oral por corrupcion', 2],
  ['proceso por corrupcion', 2],
  ['condena por corrupcion', 3],
  ['investigacion por lavado de activos', 1],
  ['juicio oral por lavado de activos', 2],
  ['nueva constitucion', 2],
  ['presion sobre el bcrp', 3],
  ['remover a julio velarde', 3],
  ['desestabilizacion politica', 2],
  ['desestabilizacion economica', 2],
  ['acercamiento a antauro humala', 4],
  ['movadef', 4],
  ['victor polay', 3],
  ['etnocacerismo', 5],
  ['autogolpe', 8],
  ['violencia', 4],
  ['represion', 4],
  ['pobreza', 2],
  ['desigualdad', 2],
  ['polarizacion', 2],
  ['abandono', 2],
  ['inestabilidad', 2],
  ['desempleo', 2],
  ['conflicto', 2],
  ['colapso', 3],
  ['deuda', 2],
  ['quiebre', 8],
  ['rebelion', 7],
  ['violaciones de derechos humanos', 6],
  ['caos', 2],
  ['improvisacion', 2],
  ['censur', 1],
  ['extorsion', 5],
  ['sicariato', 5],
  ['presunta afiliacion al terrorismo', 6],
  ['vinculos terroristas', 7],
  ['terrorista', 8],
  ['colapso fiscal', 3],
  ['desabastecimiento', 2],
  ['crisis de deuda', 2],
  ['comunismo', 5],
  ['socialismo radical', 5],
];

function getImpactDetails(item: CompareItem): ScoreDetail {
  const duration = item.category === 'presidente' ? parseDuration(item.period) : null;
  const structuredTags = getStructuredTags(item);
  const scoringExclusions = getScoringExclusions(item);
  const structuredText = joinScoringTags(structuredTags);
  const fallbackText = normalizeText(
    `${item.title} ${item.subtitle} ${item.context} ${item.resumen} ${item.positivos.join(' ')} ${item.negativos.join(' ')}`
  );
  const text = structuredText.length > 0 ? structuredText : fallbackText;
  const title = item.title.toLowerCase();

  let benefit = 0;
  let harm = 0;
  const matches: ScoreDetail['matches'] = [];

  const matchesTerm = (keyword: string) => {
    if (scoringExclusions.has(keyword)) {
      return false;
    }

    if (keyword === 'seguridad') {
      return text.includes('seguridad') && !text.includes('inseguridad');
    }

    return matchesWholeTerm(text, keyword);
  };

  IMPACT_BENEFIT_RULES.forEach(([keyword, score]) => {
    if (matchesTerm(keyword)) {
      benefit += score;
      matches.push({ label: keyword, score, kind: 'beneficio' });
    }
  });

  IMPACT_HARM_RULES.forEach(([keyword, score]) => {
    if (matchesTerm(keyword)) {
      harm += score;
      matches.push({ label: keyword, score, kind: 'daño' });
    }
  });

  const score = benefit - harm;
  let level: ScoreDetail['level'] = 'NEUTRO';

  if (score <= -8) {
    level = 'CRITICO';
  } else if (score <= -4) {
    level = 'ALTO';
  } else if (score < 4) {
    level = 'NEUTRO';
  } else if (score < 8) {
    level = 'FAVORABLE';
  } else {
    level = 'MUY_FAVORABLE';
  }

  return {
    level,
    score,
    formula: 'puntaje final = beneficios - daños',
    explanation:
      'Las acciones positivas suman al bienestar y elevan el puntaje. Las acciones negativas restan al puntaje. La medicion prioriza etiquetas estructuradas y solo cae en texto descriptivo cuando no hay etiquetas. Los resultados negativos indican mayor daño; los positivos indican mejor resultado. Los conceptos con mayor peso son los que afectan la institucionalidad, la economia o la violencia politica. La regla de seguridad se ignora si el texto dice inseguridad, para evitar falsos positivos.',
    matches,
  };
}

function getSources(item: CompareItem): SourceEntry[] {
  const title = normalizeText(item.title);
  const sources: SourceEntry[] = [
    { label: 'Ficha interna del proyecto' },
  ];

  if (title.includes('martin vizcarra')) {
    sources.push(
      {
        label: 'Reuters via Euronews: presion por reformas anticorrupcion (2019)',
        url: 'https://www.euronews.com/2019/05/30/peru-s-vizcarra-threatens-to-dissolve-congress-unless-anti-graft-reforms-passed',
      },
      {
        label: 'Bloomberg: referendum anticorrupcion respaldado por votantes',
        url: 'https://www.bloomberg.com/news/articles/2018-12-10/peru-anti-graft-referendum-boosts-vizcarra-and-punishes-congress',
      },
      { label: 'Reuters: condena por corrupcion (2025)', url: 'https://www.reutersconnect.com/item/peru-sentences-ex-president-vizcarra-to-14-years-in-prison-for-corruption/dGFnOnJldXRlcnMuY29tLDIwMjU6bmV3c21sX1ZBNTI3MjI2MTEyMDI1UlAx/dGFnOnJldXRlcnMuY29tLDIwMjU6bmV3c21sX0xWQTAwMTUyNzIyNjExMjAyNVJQMQ' },
      { label: 'AP: sentencia a 14 anos por corrupcion', url: 'https://apnews.com/article/a718a4f43843c13765cb23c32d9e0a13' },
      { label: 'World Bank: impacto de la pandemia en salud y pobreza', url: 'https://www.worldbank.org/en/country/peru/publication/resurgir-fortalecidos-evaluacion-de-pobreza-y-equidad-en-el-peru' },
      { label: 'BMJ: exceso de muertes y colapso sanitario en Peru', url: 'https://www.bmj.com/content/372/bmj.n611' },
      { label: 'PAHO: mortalidad por COVID-19 en Peru', url: 'https://journal.paho.org/en/articles/impact-covid-19-mortality-peru-using-triangulation-multiple-data-sources' }
    );
  }

  if (title.includes('pedro castillo')) {
    sources.push(
      { label: 'AP: proceso por rebelion/conspiracion', url: 'https://apnews.com/article/af153bb322fab6329cd65e1c32a2c881' },
      { label: 'TC: marco constitucional peruano', url: 'https://www.tc.gob.pe/jurisprudencia/2001/00005-2001-AI.html' }
    );
  }

  if (title.includes('manuel merino')) {
    sources.push({
      label: 'CFR: gobierno de cinco dias en Peru',
      url: 'https://www.cfr.org/articles/peru-is-about-elect-its-ninth-president-in-a-decade-what-happened-to-the-other-eight/',
    });
  }

  if (title.includes('dina boluarte')) {
    sources.push(
      {
        label: 'Defensoria del Pueblo: Informe anual 2023',
        url: 'https://www.defensoria.gob.pe/wp-content/uploads/2024/05/vigesimo_septimo_informe_anual_2023.pdf',
      },
      {
        label: 'AP: protesta y crisis en Lima',
        url: 'https://apnews.com/article/f20d6de6ee46c23f21a43e921b6b58af',
      },
      {
        label: 'AP: jornada mas mortal de las protestas',
        url: 'https://apnews.com/article/0504aa195f43640c02233c50acf00854',
      }
    );
  }

  if (title.includes('alberto fujimori')) {
    sources.push(
      {
        label: 'TC: control constitucional sobre el quiebre institucional',
        url: 'https://www.tc.gob.pe/jurisprudencia/2001/00005-2001-AI.html',
      },
      {
        label: 'CIDH: sentencia sobre crÃ­menes y derechos humanos en el periodo Fujimori',
        url: 'https://www.corteidh.or.cr/docs/casos/articulos/seriec_160_esp.pdf',
      },
      {
        label: 'Congreso/Estado peruano: quiebre institucional y autogolpe de 1992',
        url: 'https://www2.congreso.gob.pe/Sicr/RelatAgenda/procdir2001.nsf/frmProc?OpenForm&ExpandView',
      }
    );
  }

  if (title.includes('pedro pablo kuczynski')) {
    sources.push(
      {
        label: 'APEC: education reform and adaptability speech',
        url: 'https://www.apec.org/press/news-releases/2016/1007_kuczynski',
      },
      {
        label: 'APEC: Peru education reform underway',
        url: 'https://www.andina.pe/ingles/noticia-president-kuczynski-education-revolution-is-underway-in-peru-666796.aspx',
      },
      {
        label: 'Reuters via The Star: poverty reduction target',
        url: 'https://www.thestar.com.my/news/world/2016/07/11/perus-kuczynski-sets-ambitious-povertyreduction-target/',
      },
      {
        label: 'ECLAC: egalitarian societies and social reform',
        url: 'https://www.cepal.org/en/pressreleases/president-peru-calls-building-more-egalitarian-societies-take-challenges-globalization',
      },
      {
        label: 'Reuters: corruption scandal slowing investment',
        url: 'https://www.investing.com/news/economy-news/peru%27s-kuczynski-says-corruption-scandal-slowing-investment-463698',
      },
      {
        label: 'The Guardian: resignation amid corruption scandal',
        url: 'https://www.theguardian.com/world/2018/mar/21/peru-president-pedro-pablo-kuczynski-resigns-amid-corruption-scandal',
      },
      {
        label: 'Reuters via Investing: pardon of Fujimori backlash',
        url: 'https://www.investing.com/news/world-news/un-human-rights-experts-appalled-by-pardon-of-perus-fujimori-1037313',
      }
    );
  }

  if (title.includes('fuerza popular')) {
    sources.push(
      {
        label: 'Reuters / AFP: investigaciones por fondos ilegales y caso Odebrecht',
        url: 'https://www.theguardian.com/world/2017/dec/20/peru-moves-to-impeach-scandal-hit-president-pedro-pablo-kuczynski',
      },
      {
        label: 'The Guardian: Fuerza Popular y alegaciones de donaciones ilegales',
        url: 'https://www.theguardian.com/world/2017/dec/20/peru-moves-to-impeach-scandal-hit-president-pedro-pablo-kuczynski',
      },
      {
        label: 'InSight Crime: caso de lavado de dinero vinculado a Fuerza Popular',
        url: 'https://insightcrime.org/news/brief/dea-investigating-keiko-fujimori-money-laundering-case/',
      }
    );
  }

  if (title.includes('keiko fujimori')) {
    sources.push(
      {
        label: 'Reuters: inicio del juicio por lavado de activos (2024)',
        url: 'https://reuters.screenocean.com/record/1826536',
      },
      {
        label: 'Andina: juicio de Keiko fue anulado y regresado a etapa intermedia',
        url: 'https://andina.pe/ingles/noticia-peru-judiciary-annuls-keiko-fujimori-trial-returned-to-intermediate-stage-1014733.aspx',
      },
      {
        label: 'Bloomberg: proceso por lavado de millones en campañas presidenciales',
        url: 'https://www.bloomberg.com/news/articles/2024-07-01/peru-puts-political-scion-keiko-fujimori-on-trial-for-money-laundering',
      }
    );
  }

  if (title.includes('francisco sagasti')) {
    sources.push(
      {
        label: 'Congreso: Sagasti juró como presidente de la república',
        url: 'https://comunicaciones.congreso.gob.pe/noticias/francisco-sagasti-juro-como-presidente-de-la-republica/',
      },
      {
        label: 'Congreso: Sagasti fue elegido presidente del Congreso y asumió la Presidencia',
        url: 'https://comunicaciones.congreso.gob.pe/contrastes/99872/',
      }
    );
  }

  if (title.includes('jose enrique jeri ore')) {
    sources.push(
      {
        label: 'Congreso: Jerí asumió como presidente de la república tras la vacancia de Boluarte',
        url: 'https://comunicaciones.congreso.gob.pe/noticias/jose-jeri-ore-asume-como-presidente-de-la-republica-tras-la-vacancia-de-dina-boluarte/',
      },
      {
        label: 'Congreso: Jerí, presidente de la Mesa Directiva',
        url: 'https://comunicaciones.congreso.gob.pe/noticias/pleno-rechazo-mocion-de-censura-contra-la-mesa-directiva-integrada-por-jose-jeri/',
      }
    );
  }

  if (title.includes('jose maria balcazar')) {
    sources.push(
      {
        label: 'Congreso: Balcázar es elegido presidente del Congreso y asume la Presidencia',
        url: 'https://comunicaciones.congreso.gob.pe/noticias/jose-maria-balcazar-es-elegido-presidente-del-congreso-de-la-republica/',
      },
      {
        label: 'Congreso: mensaje de José María Balcázar ante el Congreso como presidente de la república',
        url: 'https://comunicaciones.congreso.gob.pe/noticias/jose-maria-balcazar-se-compromete-a-garantizar-transparencia-de-elecciones-luchar-contra-la-inseguridad-y-mantener-lineamientos-economicos/',
      }
    );
  }

  if (title.includes('juntos por el peru')) {
    sources.push(
      {
        label: 'Juntos por el Peru: Comite Ejecutivo Nacional 2026',
        url: 'https://jp.org.pe/comite-ejecutivo-nacional/',
      },
      {
        label: 'RPP: Juntos por el Peru respalda una Asamblea Constituyente',
        url: 'https://rpp.pe/politica/elecciones/juntos-por-el-peru-respalda-una-asamblea-constituyente-para-el-cambio-de-la-carta-magna-noticia-1342484',
      },
      {
        label: 'Infobae / EFE: Sanchez promete nueva Constitucion en 2026',
        url: 'https://www.infobae.com/america/agencias/2026/04/09/candidato-presidencial-peruano-sanchez-promete-liberar-a-castillo-y-una-nueva-constitucion/',
      },
      {
        label: 'Infobae: Sanchez critica la autonomia del BCRP y a Julio Velarde',
        url: 'https://www.infobae.com/peru/2026/04/16/roberto-sanchez-ya-dialoga-con-otros-partidos-y-reitera-que-nadie-es-imprescindible-en-el-bcrp/',
      },
      {
        label: 'Andina: Roberto Sanchez, candidato presidencial 2026 por Juntos por el Peru',
        url: 'https://andina.pe/agencia/noticia-elecciones-2026-conoce-hoja-vida-roberto-sanchez-juntos-por-peru-1065884.aspx',
      },
      {
        label: 'El Comercio: Cesar Tito Rojas, dirigente del Movadef, visito la PCM',
        url: 'https://elcomercio.pe/politica/cesar-tito-rojas-dirigente-del-movadef-que-visito-la-pcm-registra-denuncias-por-terrorismo-entre-2014-y-2017-guido-bellido-noticia/',
      },
      {
        label: 'Diario Correo: Anahi Durand firmo carta a favor de Victor Polay',
        url: 'https://diariocorreo.pe/politica/anahi-durand-firmo-carta-a-favor-de-victor-polay-peru-libre-noticia/',
      },
      {
        label: 'RPP: Juntos por el Peru respaldo una Asamblea Constituyente',
        url: 'https://rpp.pe/politica/elecciones/juntos-por-el-peru-respalda-una-asamblea-constituyente-para-el-cambio-de-la-carta-magna-noticia-1342484',
      },
      {
        label: 'El Comercio: acercamientos entre JPP y Antauro Humala',
        url: 'https://elcomercio.pe/politica/elecciones/elecciones-2026-antauro-humala-roberto-sanchez-de-juntos-por-el-peru-alberga-a-radical-cabecilla-del-andahuaylazo-cuyo-partido-fue-declarado-ilegal-lo-que-hay-detras-y-que-podria-decidir-el-jne-tlcnota-noticia/',
      },
      {
        label: 'Infobae: Antauro Humala y el etnocacerismo',
        url: 'https://www.infobae.com/america/peru/2022/09/11/antauro-humala-estamos-en-contra-de-la-hegemonia-criolla-extranjera-en-el-peru-y-apuntamos-a-reivindicar-a-la-mayoria-chola/',
      },
      {
        label: 'AP: conteo presidencial 2026 y liderazgo de Juntos por el Peru',
        url: 'https://apnews.com/article/a248ae37e77f23c7604a8607f81fbcb0',
      }
    );
  }

  if (title.includes('renovacion popular')) {
    sources.push(
      {
        label: 'Andina: Rafael Lopez Aliaga, presidente y lider de Renovacion Popular',
        url: 'https://andina.pe/agencia/noticia-elecciones-2026-esta-es-la-hoja-de-vida-de-rafael-lopez-aliaga-renovacion-popular-1065580.aspx',
      },
      {
        label: 'AP: conteo presidencial 2026 y disputa por el segundo puesto',
        url: 'https://apnews.com/article/ff83661d1c5c6895dc4f9a0acc56d56d',
      },
      {
        label: 'AP: Rafael Lopez Aliaga y Renovacion Popular en la contienda 2026',
        url: 'https://apnews.com/article/a248ae37e77f23c7604a8607f81fbcb0',
      }
    );
  }

  if (title.includes('roberto sanchez palomino')) {
    sources.push(
      {
        label: 'Juntos por el Peru: Comite Ejecutivo Nacional 2026',
        url: 'https://jp.org.pe/comite-ejecutivo-nacional/',
      },
      {
        label: 'RPP: Asamblea Constituyente para cambiar la Carta Magna',
        url: 'https://rpp.pe/politica/elecciones/juntos-por-el-peru-respalda-una-asamblea-constituyente-para-el-cambio-de-la-carta-magna-noticia-1342484',
      },
      {
        label: 'Infobae / EFE: nueva Constitucion en cierre de campana 2026',
        url: 'https://www.infobae.com/america/agencias/2026/04/09/candidato-presidencial-peruano-sanchez-promete-liberar-a-castillo-y-una-nueva-constitucion/',
      },
      {
        label: 'Infobae: critica a la autonomia del BCRP',
        url: 'https://www.infobae.com/peru/2026/04/16/roberto-sanchez-ya-dialoga-con-otros-partidos-y-reitera-que-nadie-es-imprescindible-en-el-bcrp/',
      },
      {
        label: 'Andina: hoja de vida de Roberto Sanchez para 2026',
        url: 'https://andina.pe/agencia/noticia-elecciones-2026-conoce-hoja-vida-roberto-sanchez-juntos-por-peru-1065884.aspx',
      },
      {
        label: 'El Comercio: Cesar Tito Rojas, dirigente del Movadef, visito la PCM',
        url: 'https://elcomercio.pe/politica/cesar-tito-rojas-dirigente-del-movadef-que-visito-la-pcm-registra-denuncias-por-terrorismo-entre-2014-y-2017-guido-bellido-noticia/',
      },
      {
        label: 'Diario Correo: Anahi Durand firmo carta a favor de Victor Polay',
        url: 'https://diariocorreo.pe/politica/anahi-durand-firmo-carta-a-favor-de-victor-polay-peru-libre-noticia/',
      },
      {
        label: 'RPP: Juntos por el Peru respaldo una Asamblea Constituyente',
        url: 'https://rpp.pe/politica/elecciones/juntos-por-el-peru-respalda-una-asamblea-constituyente-para-el-cambio-de-la-carta-magna-noticia-1342484',
      },
      {
        label: 'El Comercio: acercamientos entre JPP y Antauro Humala',
        url: 'https://elcomercio.pe/politica/elecciones/elecciones-2026-antauro-humala-roberto-sanchez-de-juntos-por-el-peru-alberga-a-radical-cabecilla-del-andahuaylazo-cuyo-partido-fue-declarado-ilegal-lo-que-hay-detras-y-que-podria-decidir-el-jne-tlcnota-noticia/',
      },
      {
        label: 'Infobae: Antauro Humala y el etnocacerismo',
        url: 'https://www.infobae.com/america/peru/2022/09/11/antauro-humala-estamos-en-contra-de-la-hegemonia-criolla-extranjera-en-el-peru-y-apuntamos-a-reivindicar-a-la-mayoria-chola/',
      },
      {
        label: 'AP: Roberto Sanchez en la carrera presidencial 2026',
        url: 'https://apnews.com/article/ff83661d1c5c6895dc4f9a0acc56d56d',
      }
    );
  }

  if (title.includes('rafael lopez aliaga')) {
    sources.push(
      {
        label: 'Andina: hoja de vida de Rafael Lopez Aliaga de Renovacion Popular',
        url: 'https://andina.pe/agencia/noticia-elecciones-2026-esta-es-la-hoja-de-vida-de-rafael-lopez-aliaga-renovacion-popular-1065580.aspx',
      },
      {
        label: 'AP: Rafael Lopez Aliaga y Renovacion Popular en la carrera 2026',
        url: 'https://apnews.com/article/ff83661d1c5c6895dc4f9a0acc56d56d',
      },
      {
        label: 'AP: lidera el conteo presidencial 2026 junto a Keiko Fujimori',
        url: 'https://apnews.com/article/a248ae37e77f23c7604a8607f81fbcb0',
      }
    );
  }

  if (title.includes('alan garcia perez (primer gobierno)')) {
    sources.push({ label: 'Historia economica peruana: hiperinflacion y crisis de deuda' });
  }

  if (title.includes('alan garcia perez (segundo gobierno)')) {
    sources.push({ label: 'Crisis de Bagua y conflicto socioambiental' });
  }

  return sources;
}

function getInstitutionalRiskLevel(item: {
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  title: string;
  subtitle: string;
  context: string;
  resumen: string;
  tags?: TagSet;
}) {
  if (item.riskLevel) return item.riskLevel;

  const tagText = joinRiskTags(item.tags);
  const fallbackText = normalizeText(`${item.title} ${item.subtitle} ${item.context} ${item.resumen}`);
  const lower = tagText.length > 0 ? tagText : fallbackText;
  if (
    lower.includes('autogolpe') ||
    lower.includes('rebelion') ||
    lower.includes('quiebre constitucional') ||
    lower.includes('ruptura constitucional') ||
    lower.includes('golpe de estado') ||
    lower.includes('terrorismo') ||
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
    lower.includes('socialismo radical') ||
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

function getMetricLevel(item: CompareItem, mode: MetricMode) {
  if (mode === 'riesgo_institucional') {
    return getInstitutionalRiskLevel(item);
  }

  return getImpactDetails(item).level;
}

function metricClass(level: string, mode: MetricMode) {
  if (mode === 'bien_comun') {
    if (level === 'MUY_FAVORABLE') return 'bg-emerald-700 text-white';
    if (level === 'FAVORABLE') return 'bg-emerald-200 text-black';
    if (level === 'NEUTRO') return 'bg-gray-200 text-gray-800';
    if (level === 'ALTO') return 'bg-amber-300 text-black';
    return 'bg-red-900 text-white ring-2 ring-red-400';
  }

  if (level === 'CRITICO') return 'bg-red-900 text-white ring-2 ring-red-400';
  if (level === 'ALTO') return 'bg-red-700 text-white';
  if (level === 'MEDIO') return 'bg-amber-300 text-black';
  return 'bg-gray-200 text-gray-800';
}

function metricRank(level: string) {
  if (level === 'CRITICO') return 5;
  if (level === 'ALTO') return 4;
  if (level === 'NEUTRO') return 3;
  if (level === 'FAVORABLE') return 2;
  if (level === 'MUY_FAVORABLE') return 1;
  if (level === 'MEDIO') return 2;
  if (level === 'BAJO') return 1;
  return 3;
}

function formatLevelLabel(level: string) {
  return level.replaceAll('_', ' ');
}

export default function PoliticalComparison({
  parties,
  leaders,
  presidents,
}: PoliticalComparisonProps) {
  const [selectedCategory, setSelectedCategory] = useState<CompareCategory>('presidente');
  const [metricMode, setMetricMode] = useState<MetricMode>('bien_comun');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<CompareItem | null>(null);

  const items: CompareItem[] = [
    ...parties.map((party) => ({
      year: party.founded,
      category: 'partido' as const,
      title: party.name,
      subtitle: party.currentLeader
        ? `${party.founder} | Lider 2026: ${party.currentLeader} | ${party.ideology}`
        : `${party.founder} | ${party.ideology}`,
      context: party.contexto,
      hechos: party.hechos,
      positivos: party.positivos,
      negativos: party.negativos,
      resumen: party.resumenAnalitico,
      period: `${party.founded}`,
      tags: party.tags ?? {
        positive: party.positivos,
        negative: party.negativos,
        risk: party.riskSignals ?? [],
        context: [party.contexto, party.ideology, party.description],
      },
      scoringExclusions: party.scoringExclusions,
      riskLevel: party.riskLevel,
      riskSignals: party.riskSignals,
      regions: inferRegions(`${party.name} ${party.contexto} ${party.resumenAnalitico} ${party.negativos.join(' ')} ${party.positivos.join(' ')}`),
      sources: getSources({
        year: party.founded,
        category: 'partido',
        title: party.name,
        subtitle: party.currentLeader
          ? `${party.founder} | Lider 2026: ${party.currentLeader} | ${party.ideology}`
          : `${party.founder} | ${party.ideology}`,
        context: party.contexto,
        hechos: party.hechos,
        positivos: party.positivos,
        negativos: party.negativos,
        resumen: party.resumenAnalitico,
        period: `${party.founded}`,
        tags: party.tags ?? {
          positive: party.positivos,
          negative: party.negativos,
          risk: party.riskSignals ?? [],
          context: [party.contexto, party.ideology, party.description],
        },
        scoringExclusions: party.scoringExclusions,
        riskLevel: party.riskLevel,
        riskSignals: party.riskSignals,
        regions: [],
        sources: [],
      }),
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
      tags: leader.tags ?? {
        positive: leader.positivos,
        negative: leader.negativos,
        risk: leader.riskSignals ?? [],
        context: [leader.contexto, leader.role, leader.party, leader.biography, leader.birthPlace],
      },
      scoringExclusions: leader.scoringExclusions,
      riskLevel: leader.riskLevel,
      riskSignals: leader.riskSignals,
      regions: inferRegions(`${leader.name} ${leader.contexto} ${leader.resumenAnalitico} ${leader.negativos.join(' ')} ${leader.positivos.join(' ')} ${leader.birthPlace}`),
      sources: getSources({
        year: leader.birthYear,
        category: 'lider',
        title: leader.name,
        subtitle: `${leader.role} | ${leader.party}`,
        context: leader.contexto,
        hechos: leader.hechos,
        positivos: leader.positivos,
        negativos: leader.negativos,
        resumen: leader.resumenAnalitico,
        period: `${leader.birthYear}${leader.deathYear ? ` - ${leader.deathYear}` : ''}`,
        tags: leader.tags ?? {
          positive: leader.positivos,
          negative: leader.negativos,
          risk: leader.riskSignals ?? [],
          context: [leader.contexto, leader.role, leader.party, leader.biography, leader.birthPlace],
        },
        scoringExclusions: leader.scoringExclusions,
        riskLevel: leader.riskLevel,
        riskSignals: leader.riskSignals,
        regions: [],
        sources: [],
      }),
    })),
    ...presidents.map((president) => {
      const year = parseStartYear(president.period);
      const combinedText = `${president.name} ${president.period} ${president.party} ${president.ideology} ${president.causes} ${president.positivos.join(
        ' '
      )} ${president.negativos.join(' ')} ${president.impactoRegional.costa} ${president.impactoRegional.sierra} ${president.impactoRegional.selva}`;
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
        tags: president.tags ?? {
          positive: president.positivos,
          negative: president.negativos,
          risk: president.riskSignals ?? [],
          context: [president.party, president.ideology, president.causes, president.impactoRegional.costa, president.impactoRegional.sierra, president.impactoRegional.selva],
        },
        scoringExclusions: president.scoringExclusions,
        riskLevel: president.riskLevel,
        riskSignals: president.riskSignals,
        regions: inferRegions(combinedText),
        sources: getSources({
          year,
          category: 'presidente',
          title: president.name,
          subtitle: `${president.period} | ${president.party} | ${president.ideology}`,
          context: president.causes,
          hechos: [`Periodo presidencial: ${president.period}`],
          positivos: president.positivos,
          negativos: president.negativos,
          resumen:
            'Gobierno definido por una mezcla de promesas de cambio, tensiones de poder y un costo institucional que se sintio de forma desigual en las regiones.',
          period: president.period,
          tags: president.tags ?? {
            positive: president.positivos,
            negative: president.negativos,
            risk: president.riskSignals ?? [],
            context: [president.party, president.ideology, president.causes, president.impactoRegional.costa, president.impactoRegional.sierra, president.impactoRegional.selva],
          },
          scoringExclusions: president.scoringExclusions,
          riskLevel: president.riskLevel,
          riskSignals: president.riskSignals,
          regions: [],
          sources: [],
        }),
      };
    }),
  ].sort((a, b) => a.year - b.year);

  const filteredItems = items.filter((item) => {
    const matchesCategory = item.category === selectedCategory;
    const haystack = `${item.title} ${item.subtitle} ${item.context} ${item.resumen} ${item.hechos.join(' ')} ${item.positivos.join(' ')} ${item.negativos.join(' ')}`.toLowerCase();
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      haystack.includes(searchTerm.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

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

  const metricLabel = metricMode === 'bien_comun' ? 'RIESGO' : 'RIESGO';
  const selectedImpact = selectedItem ? getImpactDetails(selectedItem) : null;
  const selectedRisk = selectedItem ? getInstitutionalRiskLevel(selectedItem) : null;
  const summarySource =
    metricMode === 'bien_comun'
      ? [...filteredItems].sort((a, b) => getImpactDetails(a).score - getImpactDetails(b).score)[0]
      : [...filteredItems].sort((a, b) => metricRank(getMetricLevel(b, metricMode)) - metricRank(getMetricLevel(a, metricMode)))[0];
  const summaryBottom =
    metricMode === 'bien_comun'
      ? [...filteredItems].sort((a, b) => getImpactDetails(b).score - getImpactDetails(a).score)[0]
      : [...filteredItems].sort((a, b) => metricRank(getMetricLevel(a, metricMode)) - metricRank(getMetricLevel(b, metricMode)))[0];
  const counts = filteredItems.reduce<Record<string, number>>((acc, item) => {
    const level = getMetricLevel(item, metricMode);
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const balanceCountLine = `MUY FAVORABLE: ${counts.MUY_FAVORABLE || 0} | FAVORABLE: ${counts.FAVORABLE || 0} | NEUTRO: ${counts.NEUTRO || 0} | ALTO: ${counts.ALTO || 0} | CRITICO: ${counts.CRITICO || 0}`;
  const riskCountLine = `CRITICO: ${counts.CRITICO || 0} | ALTO: ${counts.ALTO || 0} | MEDIO: ${counts.MEDIO || 0} | BAJO: ${counts.BAJO || 0}`;

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
              RIESGO NETO
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
            El primer medidor resume el riesgo neto a partir de etiquetas estructuradas y, si faltan, usa el texto de respaldo. Los valores negativos significan resultado favorable y los positivos significan daño. El segundo mide el peligro para la institucionalidad, la democracia y el orden constitucional.
          </p>
          <p className="text-[11px] leading-relaxed mt-2 border-t border-dashed border-black/30 pt-2 opacity-80">
            Nota editorial: para el caso de Dina Boluarte se priorizan fuentes institucionales y periodisticas como la Defensoria del Pueblo y AP. Este proyecto no usa Amnesty International ni Human Rights Watch como fuentes principales para ese caso, por criterio de depuracion y para mantener una base documental mas uniforme.
          </p>
          <p className="text-[11px] leading-relaxed mt-2 opacity-80">
            Regla editorial: la ideologia describe ideas y programas; el riesgo describe el dano o peligro real. El
            calculo prioriza etiquetas estructuradas y solo usa la descripcion como respaldo. Por eso "marxista" o
            "socialista" no implican automaticamente "socialismo radical". Esa etiqueta solo se usa cuando la fuente y
            el comportamiento politico muestran una deriva mas dura, confrontacional o incompatible con el pluralismo.
          </p>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-2">
          <div className="typewriter-box">
            <p className="text-xs font-bold mb-2">RESUMEN EJECUTIVO:</p>
            <div className="text-xs space-y-1">
              <p>TOTAL VISIBLE: {filteredItems.length}</p>
              <p>{metricMode === 'bien_comun' ? balanceCountLine : riskCountLine}</p>
              <p>
                {metricMode === 'bien_comun' ? 'MAYOR RIESGO' : `MAYOR ${metricLabel}`}: {summarySource ? `${summarySource.title} (${formatLevelLabel(getMetricLevel(summarySource, metricMode))})` : 'N/A'}
              </p>
              <p>
                {metricMode === 'bien_comun' ? 'MENOR RIESGO' : `MENOR ${metricLabel}`}: {summaryBottom ? `${summaryBottom.title} (${formatLevelLabel(getMetricLevel(summaryBottom, metricMode))})` : 'N/A'}
              </p>
            </div>
          </div>

          <div className="typewriter-box">
            <p className="text-xs font-bold mb-2">BUSCADOR:</p>
            <div className="space-y-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar nombre, partido, contexto o hecho..."
                className="w-full border border-black px-3 py-2 text-xs bg-white"
              />
            </div>
          </div>
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
                    {metricLabel} {formatLevelLabel(getMetricLevel(item, metricMode))}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold border border-black bg-white hover:bg-black hover:text-white transition-colors"
                  >
                    <Info size={12} />
                    COMO SE MIDE
                  </button>
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
                <div className="bg-gray-50 p-2 border border-gray-300">
                  <p className="font-bold mb-1">FUENTES:</p>
                  <ul className="typewriter-list">
                    {item.sources.map((source, idx) =>
                      source.url ? (
                        <li key={idx}>
                          <a href={source.url} target="_blank" rel="noreferrer" className="underline">
                            {source.label}
                          </a>
                        </li>
                      ) : (
                        <li key={idx}>{source.label}</li>
                      )
                    )}
                  </ul>
                </div>
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

        {selectedItem && selectedImpact && selectedRisk && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="w-full max-w-2xl bg-white border-2 border-black shadow-[8px_8px_0_#000] max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b-2 border-black p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">COMO SE MIDE</p>
                  <h3 className="text-lg font-black uppercase">{selectedItem.title}</h3>
                  <p className="text-xs text-gray-600">{selectedItem.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="border border-black p-1 hover:bg-black hover:text-white transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-4 text-xs">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="border border-black p-3">
                    <p className="font-bold mb-2">BALANCE AL PAIS</p>
                    <p>Puntaje final: {selectedImpact.score}</p>
                    <p>Nivel: {formatLevelLabel(selectedImpact.level)}</p>
                    <p className="mt-2 leading-relaxed">{selectedImpact.explanation}</p>
                    <p className="mt-2 font-bold">Formula:</p>
                    <p>{selectedImpact.formula}</p>
                  </div>
                  <div className="border border-black p-3">
                    <p className="font-bold mb-2">RIESGO INSTITUCIONAL</p>
                    <p>Nivel: {selectedRisk ? formatLevelLabel(selectedRisk) : 'N/A'}</p>
                    <p className="mt-2 leading-relaxed">
                      Este nivel sale de palabras clave y señales de ruptura institucional, autoritarismo, corrupcion,
                      represion o quiebre constitucional. Si la ficha ya trae un nivel manual, ese valor tiene prioridad.
                    </p>
                  </div>
                </div>

                <div className="border border-black p-3">
                  <p className="font-bold mb-2">REGLAS ACTIVADAS</p>
                  {selectedImpact.matches.length > 0 ? (
                    <ul className="typewriter-list">
                      {selectedImpact.matches.map((match, idx) => (
                        <li key={idx}>
                          {match.kind === 'beneficio' ? '+' : '-'}
                          {match.score} por {match.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No se activaron reglas automaticas de puntaje para esta ficha.</p>
                  )}
                </div>

                {selectedItem.riskSignals && selectedItem.riskSignals.length > 0 && (
                  <div className="border border-black p-3">
                    <p className="font-bold mb-2">SENALES DE RIESGO DE LA FICHA</p>
                    <ul className="typewriter-list">
                      {selectedItem.riskSignals.map((signal, idx) => (
                        <li key={idx}>{signal}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedItem.sources.length > 0 && (
                  <div className="border border-black p-3">
                    <p className="font-bold mb-2">FUENTES</p>
                    <ul className="typewriter-list">
                      {selectedItem.sources.map((source, idx) =>
                        source.url ? (
                          <li key={idx}>
                            <a href={source.url} target="_blank" rel="noreferrer" className="underline">
                              {source.label}
                            </a>
                          </li>
                        ) : (
                          <li key={idx}>{source.label}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
