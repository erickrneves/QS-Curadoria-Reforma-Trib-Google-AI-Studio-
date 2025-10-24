import { LawItem } from '../types';

const normalizeType = (type: string): string => {
  const lowerType = type.toLowerCase().trim();
  if (lowerType.startsWith('lc') || lowerType.includes('complementar')) return 'Lei Complementar';
  if (lowerType.startsWith('lei')) return 'Lei Ordinária';
  if (lowerType.startsWith('dec') || lowerType.includes('decreto')) return 'Decreto';
  if (lowerType.startsWith('in') || lowerType.includes('instrução normativa')) return 'Instrução Normativa';
  if (lowerType.startsWith('cf') || lowerType.includes('constituição')) return 'Constituição Federal';
  if (lowerType.startsWith('ctn') || lowerType.includes('código tributário')) return 'Código Tributário Nacional';
  return 'Desconhecido';
};

export const parseLawInput = (input: string): LawItem[] => {
  const entries = input.split(/,|\n/).map(s => s.trim()).filter(Boolean);
  const lawItems: LawItem[] = [];

  entries.forEach(entry => {
    // Regex to capture various formats like "LC 87/1996", "Lei 5172 1966", "IN RFB 2121/2022"
    const match = entry.match(/^(.*?)\s*(\d+)\s*[\/|-]?\s*(\d{4})$/i);
    if (match) {
      const [, typeStr, number, year] = match;
      const tipo = normalizeType(typeStr);
      
      if(tipo !== 'Desconhecido') {
        lawItems.push({
          id: `${tipo}-${number}-${year}`,
          rawInput: entry,
          tipo: tipo,
          numero: number,
          ano: year,
          status: 'aguardando',
        });
      }
    } else if (entry.toLowerCase().includes('constituição')) {
        lawItems.push({
            id: 'Constituicao-Federal-1988',
            rawInput: entry,
            tipo: 'Constituição Federal',
            numero: 'CF',
            ano: '1988',
            status: 'aguardando'
        });
    } else if (entry.toLowerCase().includes('código tributário nacional') || entry.toLowerCase().includes('ctn')) {
         lawItems.push({
            id: 'Lei-Ordinaria-5172-1966',
            rawInput: entry,
            tipo: 'Código Tributário Nacional',
            numero: '5172',
            ano: '1966',
            status: 'aguardando'
        });
    }
  });

  return lawItems;
};