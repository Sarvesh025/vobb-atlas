'use client';

import { Table, Kanban } from 'lucide-react';
import { useStore } from '@/store/useStore';

const ViewToggle = () => {
  const { currentView, setCurrentView } = useStore();

  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setCurrentView('tabular')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'tabular'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Table className="h-4 w-4" />
        <span>Tabular</span>
      </button>
      
      <button
        onClick={() => setCurrentView('kanban')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'kanban'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Kanban className="h-4 w-4" />
        <span>Kanban</span>
      </button>
    </div>
  );
};

export default ViewToggle;
