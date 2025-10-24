import React, { useState, useEffect, useCallback } from 'react';
import { LawItem, LogEntry, FileNode, FileStructure } from './types';
import { parseLawInput } from './utils/lawParser';
import { exportAsZip, generateFileStructure, structureToTree } from './utils/fileManager';
import fetchLawData from './services/geminiService';
import LegislationInput from './components/LegislationInput';
import LawList from './components/LawList';
import Tabs from './components/Tabs';
import FileTree from './components/FileTree';
import MetadataTable from './components/MetadataTable';
import LogViewer from './components/LogViewer';

const App: React.FC = () => {
  const [lawItems, setLawItems] = useState<LawItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [fileStructure, setFileStructure] =useState<FileStructure>({});
  const [stats, setStats] = useState({ totalTime: 0, totalSize: 0, completed: false });

  const addLog = useCallback((mensagem: string, status: LogEntry['status'], norma: string = '') => {
    setLogs(prev => [...prev, {
      id: prev.length,
      timestamp: new Date().toLocaleTimeString(),
      norma,
      mensagem,
      status
    }]);
  }, []);

  const handleAddLaws = (parsedItems: LawItem[]) => {
    setLawItems(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const newUniqueItems = parsedItems.filter(item => !existingIds.has(item.id));
      if (newUniqueItems.length > 0) {
        addLog(`Adicionado(s) ${newUniqueItems.length} novo(s) item(ns) à lista.`, 'info');
      }
      return [...prev, ...newUniqueItems];
    });
  };

  const handleRemoveLaw = (id: string) => {
    setLawItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRetryLaw = (id: string) => {
    setLawItems(prev => prev.map(item => item.id === id ? { ...item, status: 'aguardando' } : item));
    addLog('Item marcado para nova tentativa.', 'info');
  };

  const handleReset = () => {
    setLawItems([]);
    setLogs([]);
    setIsProcessing(false);
    setFileTree([]);
    setFileStructure({});
    setStats({ totalTime: 0, totalSize: 0, completed: false });
    setActiveTab(0);
    addLog('Lista e resultados resetados.', 'info');
  };

  const processQueue = async () => {
    const itemsToProcess = lawItems.filter(item => item.status === 'aguardando');
    if (itemsToProcess.length === 0) {
      addLog('Nenhum item novo para processar.', 'info');
      return 0;
    }
    
    let downloadedSize = 0;
    const updatedItems = [...lawItems];

    for (const item of itemsToProcess) {
        const index = updatedItems.findIndex(i => i.id === item.id);

        if (item.tipo === 'Desconhecido') {
            addLog(`Formato inválido, pulando.`, 'erro', item.rawInput);
            updatedItems[index] = { ...item, status: 'erro' };
            setLawItems([...updatedItems]);
            continue;
        }

        addLog('Iniciando busca...', 'processando', item.rawInput);
        updatedItems[index] = { ...item, status: 'processando' };
        setLawItems([...updatedItems]);

        try {
            const lawData = await fetchLawData(item);
            updatedItems[index] = {
                ...updatedItems[index],
                ...lawData,
                status: 'concluido',
                sourceService: lawData.fonte,
            };
            downloadedSize += lawData.conteudo.length;
            addLog(`Dados extraídos de '${lawData.fonte}'.`, 'concluido', item.rawInput);
        } catch(e) {
            updatedItems[index] = { ...updatedItems[index], status: 'erro' };
            addLog(`Erro: ${(e as Error).message}`, 'erro', item.rawInput);
        }
        setLawItems([...updatedItems]);
    }
    
    return downloadedSize;
  }

  const handleProcess = async () => {
    setIsProcessing(true);
    const startTime = performance.now();
    setStats({ totalTime: 0, totalSize: 0, completed: false });
    addLog(`Iniciando processamento...`, 'info');

    const downloadedSize = await processQueue();

    const finalFileStructure = generateFileStructure(lawItems);
    setFileStructure(finalFileStructure);
    setFileTree(structureToTree(finalFileStructure));
    
    const endTime = performance.now();
    const totalTime = parseFloat(((endTime - startTime) / 1000).toFixed(2));
    
    setStats(prev => ({
        totalTime: prev.totalTime + totalTime,
        totalSize: prev.totalSize + downloadedSize,
        completed: true
    }));

    addLog('Processamento finalizado.', 'info');
    setIsProcessing(false);
  };
  
  const handleExport = () => {
      if (Object.keys(fileStructure).length > 0) {
          addLog('Gerando arquivo ZIP para exportação...', 'info');
          exportAsZip(fileStructure, lawItems)
            .then(() => addLog('Exportação ZIP concluída.', 'concluido'))
            .catch(err => addLog(`Erro ao gerar ZIP: ${(err as Error).message}`, 'erro'));
      } else {
          addLog('Nenhum arquivo para exportar.', 'erro');
      }
  };


  const TABS = [
    { name: 'Arquivos Organizados', content: <FileTree nodes={fileTree} /> },
    { name: 'Índice de Metadados', content: <MetadataTable data={lawItems} /> },
    { name: 'Log de Processamento', content: <LogViewer logs={logs} /> },
  ];

  const hasPendingItems = lawItems.some(item => item.status === 'aguardando');
  const hasProcessedItems = Object.keys(fileStructure).length > 0;

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">Brazilian Tax Legislation Explorer</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">Busque, organize e visualize a legislação tributária brasileira.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LegislationInput onAddLaws={handleAddLaws} isProcessing={isProcessing} />
            <LawList laws={lawItems} onRemove={handleRemoveLaw} onRetry={handleRetryLaw} isProcessing={isProcessing} />
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4">
                         <button
                            onClick={handleProcess}
                            disabled={!hasPendingItems || isProcessing}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                         >
                            {isProcessing ? 'Processando...' : `Processar Item(ns)`}
                         </button>
                          <button
                            onClick={handleExport}
                            disabled={!hasProcessedItems || isProcessing}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                         >
                            Exportar ZIP
                         </button>
                    </div>
                  <button
                    onClick={handleReset}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    Resetar Lista
                  </button>
                </div>
                {stats.completed && (
                     <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-around text-sm text-gray-600 dark:text-gray-300">
                        <span>Tempo Total: <span className="font-semibold">{stats.totalTime}s</span></span>
                        <span>Tamanho Baixado: <span className="font-semibold">{(stats.totalSize / 1024 / 1024).toFixed(2)} MB</span></span>
                    </div>
                )}
            </div>
          </div>

          <div>
            <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;