import { LawItem } from '../types';

// ###################################################################################
// # ATENÇÃO: ESTE SERVIÇO FOI ALTERADO PARA FAZER SCRAPING REAL.                   #
// # Para funcionar localmente, é necessário configurar um proxy no vite.config.ts #
// # para evitar problemas de CORS.                                                 #
// ###################################################################################
//
// Exemplo de configuração para `vite.config.ts`:
//
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/planalto': {
//         target: 'https://www.planalto.gov.br',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/planalto/, ''),
//       },
//     },
//   },
// })
//
// ###################################################################################


export interface LawDetails {
    titulo: string;
    ementa: string;
    fonte: string;
    url: string;
    conteudo: string; // HTML content
}

const buildPlanaltoUrl = (item: LawItem): string | null => {
    const { tipo, numero, ano } = item;
    const num = parseInt(numero, 10);
    const year = parseInt(ano, 10);

    // Regras de roteamento de URL para o site do Planalto
    if (tipo === 'Lei Complementar') {
        return `/planalto/ccivil_03/leis/lcp/lcp${num}.htm`;
    }
    if (tipo === 'Lei Ordinária' || tipo === 'Código Tributário Nacional') {
        if (year > 2022) return `/planalto/ccivil_03/_ato2023-2026/${year}/lei/L${num}.htm`;
        if (year > 2018) return `/planalto/ccivil_03/_ato2019-2022/${year}/lei/L${num}.htm`;
        if (year > 2014) return `/planalto/ccivil_03/_ato2015-2018/${year}/lei/L${num}.htm`;
        return `/planalto/ccivil_03/leis/l${num}.htm`;
    }
    if (tipo === 'Decreto') {
        if (num > 9999) { // Decretos com 5 dígitos ou mais
             if (year > 2022) return `/planalto/ccivil_03/_ato2023-2026/${year}/decreto/D${num}.htm`;
             if (year > 2018) return `/planalto/ccivil_03/_ato2019-2022/${year}/decreto/D${num}.htm`;
        }
        return `/planalto/ccivil_03/decreto/d${num}.htm`;
    }

    return null; // Tipo de norma não suportado para busca direta
};


const parsePlanaltoHTML = (html: string): { titulo: string; ementa: string } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const titulo = doc.querySelector('title')?.textContent?.trim() || 'Título não encontrado';
    
    // Tenta múltiplos seletores para a ementa
    const ementaElement = doc.querySelector('p.ementa') || 
                          Array.from(doc.querySelectorAll('p')).find(p => p.textContent?.match(/dispõe sobre/i));
    
    let ementa = ementaElement?.textContent?.trim().replace(/\s+/g, ' ') || 'Ementa não encontrada.';

    return { titulo, ementa };
};


const fetchLawData = async (law: LawItem): Promise<LawDetails> => {
    const proxyUrl = buildPlanaltoUrl(law);

    if (!proxyUrl) {
        throw new Error(`Não foi possível construir uma URL para "${law.tipo}".`);
    }

    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
        throw new Error(`Falha na busca: ${response.status} ${response.statusText}`);
    }

    const htmlContent = await response.text();
    const { titulo, ementa } = parsePlanaltoHTML(htmlContent);

    const finalUrl = `https://www.planalto.gov.br${proxyUrl.replace('/planalto', '')}`;

    return {
        titulo,
        ementa,
        fonte: 'Planalto',
        url: finalUrl,
        conteudo: htmlContent,
    };
};

export default fetchLawData;