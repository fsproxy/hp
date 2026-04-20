export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-2 border-black">
      <div className="container max-w-4xl py-8 md:py-12">
        <div className="typewriter-box text-xs space-y-2">
          <p className="font-bold">HISTORIA DEL PERU - ARCHIVO NACIONAL</p>
          <p>Documentacion educativa sobre la historia y politica peruana</p>
          <hr className="border-black my-2" />
          <p>
            {'[ DOCUMENTO GENERADO - ACCESO PUBLICO ]'}
          </p>
          <p>
            {'[ EDUCACION CIVICA - REFERENCIA HISTORICA ]'}
          </p>
          <p className="mt-4 pt-4 border-t border-black">
            {`© ${currentYear} - ARCHIVO HISTORICO DEL PERU`}
          </p>
          <p className="text-xs text-gray-600">
            Sitio web educativo sobre la historia politica y regional del Peru
          </p>
        </div>
      </div>
    </footer>
  );
}
