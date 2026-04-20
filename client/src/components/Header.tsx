import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'home', label: 'INICIO' },
    { id: 'history', label: 'HISTORIA' },
    { id: 'powers', label: 'PODERES' },
    { id: 'presidents', label: 'PRESIDENTES' },
    { id: 'regions', label: 'REGIONES' },
    { id: 'comparison', label: 'BALANCE' },
    { id: 'about', label: 'SITIO' },
  ];

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b-2 border-black bg-white sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between py-4 md:py-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleSectionClick('home')}
              className="typewriter-title text-lg md:text-2xl"
            >
              [HP]
            </button>
            <p className="typewriter-subtitle text-xs mt-1">HISTORIA DEL PERU</p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`typewriter-button text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 ${
                  activeSection === section.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden typewriter-button p-2"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t-2 border-black py-4 flex flex-col gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`typewriter-button w-full text-left text-xs py-2 px-3 ${
                  activeSection === section.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
