interface Power {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  structure: string;
  senateFunctions?: string[];
  deputyFunctions?: string[];
  institutions?: string[];
}

interface PowersSectionProps {
  powers: Power[];
}

export default function PowersSection({ powers }: PowersSectionProps) {
  return (
    <section id="powers" className="bg-white py-12 md:py-16 border-b-2 border-black">
      <div className="container max-w-4xl">
        <h2 className="section-title mb-8">TRES PODERES DEL ESTADO</h2>

        <div className="space-y-6">
          {powers.map((power) => (
            <div key={power.id} className="typewriter-box">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2">
                [{power.name}]
              </h3>

              <p className="text-xs leading-relaxed mb-3">{power.description}</p>

              <div className="mb-3 text-xs space-y-1">
                <p>
                  <span className="font-bold">ESTRUCTURA:</span> {power.structure}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-xs font-bold mb-1">RESPONSABILIDADES:</p>
                <ul className="typewriter-list text-xs">
                  {power.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>

              {power.senateFunctions && (
                <div className="mb-3">
                  <p className="text-xs font-bold mb-1">FUNCIONES DEL SENADO:</p>
                  <ul className="typewriter-list text-xs">
                    {power.senateFunctions.map((func, idx) => (
                      <li key={idx}>{func}</li>
                    ))}
                  </ul>
                </div>
              )}

              {power.deputyFunctions && (
                <div className="mb-3">
                  <p className="text-xs font-bold mb-1">FUNCIONES DE DIPUTADOS:</p>
                  <ul className="typewriter-list text-xs">
                    {power.deputyFunctions.map((func, idx) => (
                      <li key={idx}>{func}</li>
                    ))}
                  </ul>
                </div>
              )}

              {power.institutions && (
                <div>
                  <p className="text-xs font-bold mb-1">INSTITUCIONES:</p>
                  <ul className="typewriter-list text-xs">
                    {power.institutions.map((inst, idx) => (
                      <li key={idx}>{inst}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <hr className="divider-line mt-8" />

        <div className="typewriter-box mt-6">
          <p className="text-xs font-bold mb-2">SISTEMA BICAMERAL 2026:</p>
          <p className="text-xs leading-relaxed mb-2">
            A partir de 2026, el Peru implemento un sistema bicameral en el Congreso de la Republica. El Senado (60 miembros) actua como camara alta con funciones de control y nombramiento de altos funcionarios. La Camara de Diputados (130 miembros) funciona como camara baja encargada de legislacion ordinaria.
          </p>
        </div>
      </div>
    </section>
  );
}
