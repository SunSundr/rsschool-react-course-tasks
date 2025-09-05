import { chemicalFormulas, formatSubscript } from './unicodeSubscripts';

export const formatLabel = (key: string): string => {
  const lowerKey = key.toLowerCase();

  if (chemicalFormulas[lowerKey]) {
    return chemicalFormulas[lowerKey];
  }

  let formatted = key.replace(/([A-Za-z]+)(\d+)/g, (_match, element, numbers) => {
    const formulaKey = (element + numbers).toLowerCase();
    if (chemicalFormulas[formulaKey]) {
      return chemicalFormulas[formulaKey];
    }

    return element + formatSubscript(numbers);
  });

  formatted = formatted
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\b(Gdp|Gni|Cpi|Ppp|Ghg|Co2e)\b/gi, (match) => match.toUpperCase())
    .replace(/\b(And|Or|The|Of|In|On|At|To|For)\b/gi, (match) => match.toLowerCase())
    .replace(/\s+/g, ' ')
    .trim();

  return formatted;
};
