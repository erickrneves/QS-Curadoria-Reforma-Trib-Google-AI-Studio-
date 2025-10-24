export type LawStatus = 'aguardando' | 'processando' | 'concluido' | 'erro';

export interface LawItem {
  id: string;
  rawInput: string;
  tipo: string;
  numero: string;
  ano: string;
  titulo?: string;
  ementa?: string;
  fonte?: string;
  url?: string;
  arquivoLocal?: string;
  conteudo?: string;
  status: LawStatus;
  sourceService?: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  norma: string;
  mensagem: string;
  status: LawStatus | 'info';
}

export interface FileNode {
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
  path?: string;
}

export type FileStructure = Record<string, string>;