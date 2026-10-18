import React from 'react';

const ITEMS = [
  { className: 'pos-cl', label: 'Champions League' },
  { className: 'pos-el', label: 'Europa League' },
  { className: 'pos-relegation', label: 'Relegation' },
] as const;

const StandingsLegend: React.FC = () => (
  <ul className="standings-legend" aria-label="Position key">
    {ITEMS.map((item) => (
      <li key={item.className}>
        <span className={`legend-swatch ${item.className}`} aria-hidden />
        {item.label}
      </li>
    ))}
  </ul>
);

export default StandingsLegend;
