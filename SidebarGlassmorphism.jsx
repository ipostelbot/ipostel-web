import { useState, useEffect } from 'react';

/* ============================================
   SidebarGlassmorphism.jsx
   Componente React + Tailwind CSS
   ============================================

   Configuración requerida en tailwind.config.js:
   
   module.exports = {
     theme: {
       extend: {
         colors: {
           borgoyna: {
             50:  '#fdf2f4',
             100: '#fce7eb',
             200: '#f9d0da',
             300: '#f4a9bc',
             400: '#ec7696',
             500: '#e04872',
             600: '#cc2858',
             700: '#ab1c47',
             800: '#8b1a3d',
             900: '#5c0e29',
             950: '#380616',
           },
         },
         backdropBlur: {
           '3xl': '64px',
         },
       },
     },
   };
*/

const navItems = [
  { id: 'home',    label: 'Home',    icon: 'home' },
  { id: 'measure', label: 'Measure', icon: 'measure' },
  { id: 'analyze', label: 'Analyze', icon: 'analyze' },
  { id: 'reduce',  label: 'Reduce',  icon: 'reduce' },
  { id: 'report',  label: 'Report',  icon: 'report' },
];

const activeId = 'reduce';

function NavIcon({ name, size = 20 }) {
  const s = size;
  const icons = {
    leaf: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
    home: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    ),
    measure: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/>
        <path d="m14.5 12.5 2-2"/>
        <path d="m11.5 9.5 2-2"/>
        <path d="m8.5 6.5 2-2"/>
        <path d="m17.5 15.5 2-2"/>
      </svg>
    ),
    analyze: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
        <path d="M7 16h8"/>
        <path d="M7 11h12"/>
        <path d="M7 6h3"/>
      </svg>
    ),
    reduce: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8"/>
        <path d="m14 10-4 4"/>
        <path d="M10 14h4"/>
        <path d="M12 18V6"/>
      </svg>
    ),
    report: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M8 13h2"/>
        <path d="M8 17h2"/>
        <path d="M14 13h2"/>
        <path d="M14 17h2"/>
      </svg>
    ),
    calendar: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4"/>
        <path d="M16 2v4"/>
        <rect width="18" height="18" x="3" y="4" rx="2"/>
        <path d="M3 10h18"/>
      </svg>
    ),
    chevronLeft: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    ),
  };
  return icons[name] || null;
}

function Particles() {
  const [dots] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 4,
      opacity: Math.random() * 0.15 + 0.05,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            backgroundColor: 'rgba(255,255,255,0.6)',
            opacity: d.opacity,
            animation: `particleFloat ${d.duration}s ease-in-out ${d.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes particleFloat {
          0%   { transform: translateY(0) scale(1); opacity: 0.05; }
          50%  { opacity: 0.2; }
          100% { transform: translateY(-12px) scale(1.3); opacity: 0.08; }
        }
      `}</style>
    </div>
  );
}

export default function SidebarGlassmorphism() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setExpanded(e.matches);
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className={`
        relative flex overflow-hidden
        rounded-3xl
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${expanded ? 'w-64' : 'w-[72px]'}
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.25),
          inset 0 -1px 0 rgba(255, 255, 255, 0.08)
        `,
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Particles />

      {/* ── MINIMIZED BAR (Left) ── */}
      <div className="relative z-10 flex flex-col items-center py-5 gap-1 flex-shrink-0 w-[72px]">
        {/* Logo */}
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-borgoyna-700 hover:bg-white/10 transition-colors duration-200 mb-3">
          <NavIcon name="leaf" size={22} />
        </button>

        {/* Nav items */}
        {navItems.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (!expanded) setExpanded(true);
              }}
              className={`
                group relative w-10 h-10 flex items-center justify-center
                rounded-xl transition-all duration-300 ease-out
                ${isActive
                  ? 'bg-borgoyna-900 text-white shadow-lg shadow-borgoyna-900/30'
                  : 'text-gray-500 hover:text-borgoyna-700 hover:bg-white/10'
                }
              `}
              title={item.label}
            >
              <NavIcon name={item.icon} size={18} />
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[2px] w-1 h-5 bg-borgoyna-700 rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── EXPANDED PANEL (Right) ── */}
      <div
        className={`
          relative z-10 flex flex-col
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          border-l border-white/10
          ${expanded ? 'opacity-100 w-44' : 'opacity-0 w-0 overflow-hidden'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 flex-shrink-0">
          <button
            onClick={() => setExpanded(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-borgoyna-700 hover:bg-white/10 transition-all duration-200"
          >
            <NavIcon name="chevronLeft" size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-borgoyna-700 hover:bg-white/10 transition-all duration-200">
            <NavIcon name="calendar" size={16} />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1 px-3 flex-1">
          {navItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-300 ease-out
                  ${isActive
                    ? 'bg-white text-borgoyna-900 shadow-md shadow-black/5 w-full'
                    : 'text-gray-500 hover:text-borgoyna-700 hover:bg-white/8 w-full'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-borgoyna-700 rounded-r-full" />
                )}
                <span
                  className={`
                    w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0
                    ${isActive
                      ? 'bg-borgoyna-900 text-white'
                      : 'text-gray-400'
                    }
                  `}
                >
                  <NavIcon name={item.icon} size={15} />
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom spacer */}
        <div className="h-4 flex-shrink-0" />
      </div>
    </div>
  );
}
