import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { LawItem, FileNode, FileStructure } from '../types';

const getFolderPath = (item: LawItem): string => {
  switch (item.tipo) {
    case 'Constituição Federal':
      return '01_Constituicao_Federal';
    case 'Código Tributário Nacional':
      return '02_Codigo_Tributario_Nacional';
    case 'Lei Complementar':
      return '03_Leis_Complementares';
    case 'Lei Ordinária':
      return '04_Leis_Ordinarias';
    case 'Decreto':
      return '05_Decretos_Regulamentos';
    case 'Instrução Normativa':
      return '06_Instrucoes_Normativas_RFB';
    default:
      return '11_Outros';
  }
};

const getFileName = (item: LawItem): string => {
    if (item.tipo === 'Constituição Federal') return 'Constituicao_Federal_1988.html';
    if (item.tipo === 'Código Tributário Nacional') return 'Lei_5172_1966.html';

    const typeSlug = item.tipo.replace(/\s+/g, '_');
    return `${typeSlug}_${item.numero}_${item.ano}.html`;
};

export const generateFileStructure = (processedItems: LawItem[]): FileStructure => {
    const files: FileStructure = {};
    processedItems
        .filter(item => item.status === 'concluido' && item.conteudo)
        .forEach(item => {
            const folder = getFolderPath(item);
            const filename = getFileName(item);
            const path = `01_LEGISLACAO_TRIBUTARIA/${folder}/${filename}`;
            files[path] = item.conteudo!;
            item.arquivoLocal = path;
        });
    return files;
};

export const structureToTree = (files: FileStructure): FileNode[] => {
    const root: FileNode = { name: 'root', type: 'folder', children: [] };

    Object.keys(files).forEach(path => {
        const parts = path.split('/');
        let currentNode = root;

        parts.forEach((part, index) => {
            let childNode = currentNode.children?.find(child => child.name === part);

            if (!childNode) {
                childNode = {
                    name: part,
                    type: index === parts.length - 1 ? 'file' : 'folder',
                    path: index === parts.length - 1 ? path : undefined,
                };
                if (childNode.type === 'folder') {
                    childNode.children = [];
                }
                currentNode.children?.push(childNode);
            }
            currentNode = childNode;
        });
    });
    
    // Fix: Refactored sortNodes to be a pure function that returns the sorted array, resolving a subtle compilation issue.
    const sortNodes = (nodes: FileNode[]): FileNode[] => {
        nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
        });
        nodes.forEach(node => {
            if (node.children) {
                node.children = sortNodes(node.children);
            }
        });
        return nodes;
    };
    
    if (root.children) {
        root.children = sortNodes(root.children);
    }

    return root.children || [];
};

export const exportAsZip = async (files: FileStructure, metadata: LawItem[]): Promise<void> => {
  const zip = new JSZip();

  Object.entries(files).forEach(([path, content]) => {
    zip.file(path, content);
  });

  // Generate and add metadata files
  const successfulItems = metadata.filter(item => item.status === 'concluido');

  // JSON index
  const jsonIndex = JSON.stringify(successfulItems.map(item => ({
    tipo: item.tipo,
    numero: item.numero,
    ano: item.ano,
    titulo: item.titulo,
    ementa: item.ementa,
    fonte: item.fonte,
    url: item.url,
    arquivo_local: item.arquivoLocal,
  })), null, 2);
  zip.file('legislacao_index.json', jsonIndex);

  // CSV index
  const csvData = successfulItems.map(item => ({
    tipo: item.tipo,
    numero: item.numero,
    ano: item.ano,
    titulo: item.titulo || '',
    ementa: item.ementa || '',
    fonte: item.fonte || '',
    url: item.url || '',
    arquivo_local: item.arquivoLocal || '',
  }));
  const csvIndex = Papa.unparse(csvData);
  zip.file('legislacao_index.csv', csvIndex);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'legislacao_tributaria.zip');
};