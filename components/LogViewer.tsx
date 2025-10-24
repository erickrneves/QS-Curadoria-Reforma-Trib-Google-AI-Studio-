import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface LogViewerProps {
  logs: LogEntry[];
}

const statusStyles: Record<LogEntry['status'], string> = {
  info: 'text-gray-500 dark:text-gray-400',
  processando: 'text-blue-500 dark:text-blue-400',
  concluido: 'text-green-500 dark:text-green-400',
  erro: 'text-red-500 dark:text-red-400',
  aguardando: 'text-gray-400'
};

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (logs.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 p-8">O log de processamento está vazio.</div>;
  }

  return (
    <div className="h-full max-h-96 overflow-y-auto font-mono text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
      {logs.map((log) => (
        <div key={log.id} className={`flex ${statusStyles[log.status]}`}>
          <span className="w-20 shrink-0 text-gray-400 dark:text-gray-500">{log.timestamp}</span>
          <span className="font-bold w-20 shrink-0 mr-2">[{log.status.toUpperCase()}]</span>
          <span>{log.norma ? `[${log.norma}] ` : ''}{log.mensagem}</span>
        </div>
      ))}
      <div ref={endOfLogsRef} />
    </div>
  );
};

export default LogViewer;