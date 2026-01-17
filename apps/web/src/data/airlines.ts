export interface Airline {
  code: string;
  name: string;
}

export const airlines: Airline[] = [
  { code: 'AC', name: 'Air Canada' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'AS', name: 'Alaska Airlines' },
  { code: 'B6', name: 'JetBlue Airways' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'F9', name: 'Frontier Airlines' },
  { code: 'NK', name: 'Spirit Airlines' },
  { code: 'PD', name: 'Porter Airlines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'WN', name: 'Southwest Airlines' },
  { code: 'WS', name: 'WestJet' },
  { code: 'OT', name: 'Other' },
];

export const getAirlineName = (code: string): string => {
  const airline = airlines.find((a) => a.code === code);
  return airline ? airline.name : code;
};
