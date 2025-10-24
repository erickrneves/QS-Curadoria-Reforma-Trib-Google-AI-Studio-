import React from 'react';
import { LawItem } from '../types';

interface MetadataTableProps {
  data: LawItem[];
}

const MetadataTable: React.FC<MetadataTableProps> = ({ data }) => {
  const processedData = data.filter(item => item.status === 'concluido');

  if (processedData.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 p-8">Nenhum metadado para exibir. Processe alguns itens primeiro.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Norma</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Título</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fonte</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {processedData.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{`${item.tipo} ${item.numero}/${item.ano}`}</td>
              <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {item.titulo || 'N/A'}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.fonte || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetadataTable;