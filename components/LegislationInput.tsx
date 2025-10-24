import React, { useState } from 'react';
import Tooltip from './Tooltip';
import { LawItem } from '../types';
import { parseLawInput } from '../utils/lawParser';

interface LegislationInputProps {
  onAddLaws: (laws: LawItem[]) => void;
  isProcessing: boolean;
}

const LegislationInput: React.FC<LegislationInputProps> = ({ onAddLaws, isProcessing }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleAddClick = () => {
    if (inputValue.trim()) {
      const parsedLaws = parseLawInput(inputValue);
      onAddLaws(parsedLaws);
      setInputValue('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <label htmlFor="legislation-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
          Adicionar Legislação
        </label>
        <Tooltip text="Separe as normas por vírgula ou quebra de linha. Ex: LC 87/1996, Lei 5172/1966">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </Tooltip>
      </div>
      <textarea
        id="legislation-input"
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="Ex: LC 87/1996, Lei 5172/1966, Decreto 9580/2018..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isProcessing}
      />
      <div className="mt-3 text-right">
        <button
          onClick={handleAddClick}
          disabled={!inputValue.trim() || isProcessing}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Adicionar à Lista
        </button>
      </div>
    </div>
  );
};

export default LegislationInput;