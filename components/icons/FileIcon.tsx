import React from 'react';

const FileIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-12a1 1 0 01-1-1v-2a1 1 0 011-1V4zm2 0v12h8V4H6z" clipRule="evenodd" />
  </svg>
);

export default FileIcon;