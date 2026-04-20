interface HeroSectionProps {
  onExplore: () => void;
}

export default function HeroSection({ onExplore }: HeroSectionProps) {
  return (
    <section className="bg-white py-16 md:py-24 border-b-2 border-black">
      <div className="container max-w-3xl">
        <div className="space-y-6">
          {/* Title */}
          <h1 className="typewriter-title text-3xl md:text-5xl">
            HISTORIA DEL PERU
          </h1>

          {/* Subtitle */}
          <div className="typewriter-subtitle text-sm md:text-base space-y-2">
            <p>
              {'>> Un archivo de la nacion andina'}
            </p>
            <p>
              {'>> Desde los imperios antiguos hasta la politica moderna'}
            </p>
            <p>
              {'>> Documentacion historica y analisis politico'}
            </p>
          </div>

          {/* Divider */}
          <hr className="divider-line" />

          {/* Description */}
          <div className="typewriter-box">
            <p className="mb-4">
              BIENVENIDO AL ARCHIVO HISTORICO DEL PERU
            </p>
            <p className="text-xs md:text-sm leading-relaxed">
              Este documento contiene un registro completo de la historia peruana, desde los antiguos imperios prehispanicos hasta los sistemas politicos contemporaneos. Incluye analisis de periodos historicos, partidos politicos, lideres influyentes, estructura de poderes del estado, linea de tiempo presidencial y analisis sociologico regional.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <button
              onClick={onExplore}
              className="typewriter-button text-sm md:text-base flex-1"
            >
              {'> EXPLORAR HISTORIA'}
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('comparison');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="typewriter-button text-sm md:text-base flex-1 bg-black text-white"
            >
              {'> VER BALANCE'}
            </button>
          </div>

          {/* Footer Note */}
          <div className="typewriter-subtitle text-xs mt-8 pt-4 border-t border-black">
            <p>[ DOCUMENTO GENERADO - ARCHIVO NACIONAL ]</p>
            <p>[ ACCESO PUBLICO - EDUCACION CIVICA ]</p>
          </div>
        </div>
      </div>
    </section>
  );
}
