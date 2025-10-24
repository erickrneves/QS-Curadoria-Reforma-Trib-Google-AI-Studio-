import React from 'react';
import { LawItem, LawStatus } from '../types';

interface LawListProps {
  laws: LawItem[];
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  isProcessing: boolean;
}

const statusStyles: Record<LawStatus, { bg: string; text: string; label: string }> = {
  aguardando: { bg: 'bg-gray-200 dark:bg-gray-600', text: 'text-gray-800 dark:text-gray-200', label: 'Aguardando' },
  processando: { bg: 'bg-blue-200 dark:bg-blue-800', text: 'text-blue-800 dark:text-blue-200', label: 'Processando' },
  concluido: { bg: 'bg-green-200 dark:bg-green-800', text: 'text-green-800 dark:text-green-200', label: 'Concluído' },
  erro: { bg: 'bg-red-200 dark:bg-red-800', text: 'text-red-800 dark:text-red-200', label: 'Erro' },
};

const LawList: React.FC<LawListProps> = ({ laws, onRemove, onRetry, isProcessing }) => {
  if (laws.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-500 dark:text-gray-400">A lista de processamento está vazia.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Adicione leis no campo acima para começar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {laws.map((law) => (
          <li key={law.id} className="px-4 py-3 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{law.rawInput}</p>
              <p className={`text-xs ${law.tipo && law.tipo !== 'Desconhecido' ? 'text-gray-500 dark:text-gray-400' : 'text-red-500'}`}>
                {law.tipo && law.tipo !== 'Desconhecido' ? `${law.tipo} ${law.numero}/${law.ano}` : 'Formato inválido'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[law.status].bg} ${statusStyles[law.status].text}`}>
                {statusStyles[law.status].label}
              </span>
              {law.status === 'erro' && (
                 <button
                    onClick={() => onRetry(law.id)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                    aria-label={`Reprocessar ${law.rawInput}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                </button>
              )}
              <button
                onClick={() => onRemove(law.id)}
                disabled={isProcessing}
                className="text-gray-400 hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                aria-label={`Remover ${law.rawInput}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LawList;