export const SUBSCRIPT = {
  '0': '\u2080',
  '1': '\u2081',
  '2': '\u2082',
  '3': '\u2083',
  '4': '\u2084',
  '5': '\u2085',
  '6': '\u2086',
  '7': '\u2087',
  '8': '\u2088',
  '9': '\u2089',
  '+': '\u208A',
  '-': '\u208B',
  '=': '\u208C',
  '(': '\u208D',
  ')': '\u208E',
} as const;

export const formatSubscript = (text: string): string => {
  return text
    .split('')
    .map((char) => SUBSCRIPT[char as keyof typeof SUBSCRIPT] || char)
    .join('');
};

export const chemicalFormulas: { [key: string]: string } = {
  co2: `CO${SUBSCRIPT['2']}`,
  n2o: `N${SUBSCRIPT['2']}O`,
  ch4: `CH${SUBSCRIPT['4']}`,
  no2: `NO${SUBSCRIPT['2']}`,
  so2: `SO${SUBSCRIPT['2']}`,
  nh3: `NH${SUBSCRIPT['3']}`,
  h2o: `H${SUBSCRIPT['2']}O`,
  ch2o: `CH${SUBSCRIPT['2']}O`,
  o3: `O${SUBSCRIPT['3']}`,
  sf6: `SF${SUBSCRIPT['6']}`,
  nf3: `NF${SUBSCRIPT['3']}`,
  pfc: 'PFC',
  hfc: 'HFC',
};
