import React from 'react';

interface TabsProps {
  tabs: { name: string; content: React.ReactNode }[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={activeTab}
          onChange={(e) => setActiveTab(parseInt(e.target.value, 10))}
        >
          {tabs.map((tab, index) => (
            <option key={tab.name} value={index}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab, index) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(index)}
                className={`${
                  activeTab === index
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md min-h-[300px]">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;