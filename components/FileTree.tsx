import React, { useState } from 'react';
import { FileNode } from '../types';
import FolderIcon from './icons/FolderIcon';
import FileIcon from './icons/FileIcon';

interface FileTreeProps {
  nodes: FileNode[];
}

const TreeNode: React.FC<{ node: FileNode; level?: number }> = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === 'folder') {
    return (
      <div style={{ paddingLeft: `${level * 1.5}rem` }}>
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center w-full text-left py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <svg className={`w-4 h-4 mr-1 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          <FolderIcon className="w-5 h-5 mr-2 text-yellow-500" />
          <span className="font-medium">{node.name}</span>
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: `${level * 1.5}rem` }} className="flex items-center py-1 text-gray-600 dark:text-gray-400">
      <FileIcon className="w-5 h-5 mr-2 text-gray-400" />
      <span>{node.name}</span>
    </div>
  );
};

const FileTree: React.FC<FileTreeProps> = ({ nodes }) => {
  if (nodes.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 p-8">Nenhum arquivo processado ainda.</div>;
  }

  return (
    <div className="font-mono text-sm">
      {nodes.map((node, index) => (
        <TreeNode key={index} node={node} />
      ))}
    </div>
  );
};

export default FileTree;