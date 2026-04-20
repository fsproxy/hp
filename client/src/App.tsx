import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HistorySection from './components/HistorySection';
import PoliticalComparison from './components/PoliticalComparison';
import PowersSection from './components/PowersSection';
import PresidentsTimeline from './components/PresidentsTimeline';
import RegionalAnalysis from './components/RegionalAnalysis';
import Footer from './components/Footer';
import ErrorBoundary from "./components/ErrorBoundary";
import { useContent } from './hooks/useContent';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const { data, loading } = useContent();

  useEffect(() => {
    const sectionIds = [
      'home',
      'history',
      'powers',
      'presidents',
      'regions',
      'comparison',
      'about',
    ];

    const updateActiveSection = () => {
      if (window.scrollY < 120) {
        setActiveSection('home');
        return;
      }

      const offset = 180;
      let current = 'home';

      for (const id of sectionIds.slice(1)) {
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();

    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === 'history') {
      const element = document.getElementById('history');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'comparison') {
      const element = document.getElementById('comparison');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'powers') {
      const element = document.getElementById('powers');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'presidents') {
      const element = document.getElementById('presidents');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'regions') {
      const element = document.getElementById('regions');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'about') {
      const element = document.getElementById('about');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-lora text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col bg-white">
            <Header activeSection={activeSection} onSectionChange={handleSectionChange} />

            <main className="flex-1">
              <HeroSection
                onExplore={() => handleSectionChange('history')}
              />

              <HistorySection periods={data.historicalPeriods} />

              <div id="powers">
                <PowersSection powers={data.governmentPowers} />
              </div>

              <div id="presidents">
                <PresidentsTimeline presidents={data.presidents} />
              </div>

              <div id="regions">
                <RegionalAnalysis regions={data.regionalAnalysis} />
              </div>

              <PoliticalComparison
                parties={data.politicalParties}
                leaders={data.politicalLeaders}
                presidents={data.presidentialAnalysis || []}
              />

              {/* About Section */}
              <section id="about" className="py-20 md:py-32 bg-white">
                <div className="container max-w-4xl">
                  <h2 className="section-title text-center mb-12">Acerca de Este Sitio</h2>

                  <div className="space-y-6 font-lora text-gray-700 leading-relaxed">
                    <p>
                      Este sitio web fue creado con el propósito de proporcionar una plataforma educativa
                      completa sobre la historia del Perú y su sistema político. Nuestro objetivo es hacer
                      la historia accesible y atractiva para estudiantes, investigadores y ciudadanos
                      interesados en comprender mejor la evolución de la nación peruana.
                    </p>

                    <p>
                      La historia del Perú es una de las más ricas y complejas de América Latina. Desde
                      los antiguos imperios prehispánicos como los Incas, pasando por la era colonial
                      española, hasta la República moderna, el Perú ha experimentado transformaciones
                      profundas que han moldeado su identidad nacional.
                    </p>

                    <p>
                      El sistema de partidos políticos peruano refleja esta diversidad. A lo largo de los
                      siglos, diferentes movimientos políticos han surgido, representando ideologías y
                      visiones diversas para el futuro del país. Desde los partidos tradicionales del siglo
                      XX hasta los movimientos políticos contemporáneos, cada uno ha dejado su marca en la
                      historia política peruana.
                    </p>

                    <p>
                      Esperamos que este sitio sirva como una herramienta valiosa para aprender, reflexionar
                      y entender mejor la compleja historia y política del Perú. La educación y el conocimiento
                      son fundamentales para construir una sociedad más informada y democrática.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2" style={{fontFamily: "'Playfair Display', serif"}}>14,000+</div>
                      <p className="font-lora text-gray-600">Años de Historia</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2" style={{fontFamily: "'Playfair Display', serif"}}>6</div>
                      <p className="font-lora text-gray-600">Períodos Históricos</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2" style={{fontFamily: "'Playfair Display', serif"}}>10+</div>
                      <p className="font-lora text-gray-600">Partidos Políticos</p>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            <Footer />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
