'use client';

import { useMemo, useState } from 'react';
import { Eye, EyeOff, Edit, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Deal, DealStage } from '@/types';
import { api } from '@/services/api';

const TabularView = () => {
  const { deals, viewPreferences, setViewPreferences, deleteDeal, setActiveDeal, setLoading, setError } = useStore();
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<'All' | DealStage>('All');
  const [sortKey, setSortKey] = useState<'clientName' | 'productName' | 'stage' | 'createdDate'>('clientName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleDeleteDeal = async (deal: Deal) => {
    if (window.confirm(`Are you sure you want to delete the deal for ${deal.clientName}?`)) {
      try {
        setLoading(true);
        await api.deleteDeal(deal.id);
        deleteDeal(deal.id);
      } catch {
        setError('Failed to delete deal');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleColumn = (column: keyof typeof viewPreferences.tabular) => {
    setViewPreferences({
      tabular: {
        ...viewPreferences.tabular,
        [column]: !viewPreferences.tabular[column],
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const pipelineStages: DealStage[] = [
    'Lead Generated',
    'Contacted',
    'Application Submitted',
    'Application Under Review',
    'Deal Finalized',
    'Payment Confirmed',
    'Completed',
    'Lost',
  ];

  const filteredAndSortedDeals = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const filtered = deals.filter((deal) => {
      const matchesStage = stageFilter === 'All' ? true : deal.stage === stageFilter;
      if (!normalizedQuery) return matchesStage;
      const haystack = `${deal.clientName} ${deal.productName} ${deal.notes ?? ''}`.toLowerCase();
      const matchesQuery = haystack.includes(normalizedQuery);
      return matchesStage && matchesQuery;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'createdDate') {
        const diff = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        return sortDir === 'asc' ? diff : -diff;
      }
      const aVal = a[sortKey] as string;
      const bVal = b[sortKey] as string;
      const cmp = aVal.localeCompare(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [deals, searchTerm, stageFilter, sortKey, sortDir]);

  const toggleSort = (key: 'clientName' | 'productName' | 'stage' | 'createdDate') => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ active }: { active: boolean }) => {
    if (!active) return <ArrowUpDown className="h-3.5 w-3.5 inline" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5 inline" /> : <ArrowDown className="h-3.5 w-3.5 inline" />;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with column toggle */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Deals Table</h3>
          <div className="relative">
            <button
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {showColumnToggle ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>Columns</span>
            </button>
            
            {showColumnToggle && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-2">
                  {Object.entries(viewPreferences.tabular).map(([key, visible]) => (
                    <button
                      key={key}
                      onClick={() => toggleColumn(key as keyof typeof viewPreferences.tabular)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls + Table */}
      <div className="overflow-x-auto">
        {/* Controls */}
        <div className="px-6 pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-80">
            <div className="relative flex-1">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search deals..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label className="sr-only">Stage filter</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as 'All' | DealStage)}
              className="w-full sm:w-56 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Stages</option>
              {pipelineStages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {viewPreferences.tabular.showClientName && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('clientName')} className="inline-flex items-center gap-1 hover:text-gray-700">
                    Client Name <SortIcon active={sortKey === 'clientName'} />
                  </button>
                </th>
              )}
              {viewPreferences.tabular.showProductName && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('productName')} className="inline-flex items-center gap-1 hover:text-gray-700">
                    Product Name <SortIcon active={sortKey === 'productName'} />
                  </button>
                </th>
              )}
              {viewPreferences.tabular.showStage && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('stage')} className="inline-flex items-center gap-1 hover:text-gray-700">
                    Stage <SortIcon active={sortKey === 'stage'} />
                  </button>
                </th>
              )}
              {viewPreferences.tabular.showCreatedDate && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('createdDate')} className="inline-flex items-center gap-1 hover:text-gray-700">
                    Created Date <SortIcon active={sortKey === 'createdDate'} />
                  </button>
                </th>
              )}
              {viewPreferences.tabular.showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedDeals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-50">
                {viewPreferences.tabular.showClientName && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {deal.clientName}
                  </td>
                )}
                {viewPreferences.tabular.showProductName && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deal.productName}
                  </td>
                )}
                {viewPreferences.tabular.showStage && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      deal.stage === 'Completed' ? 'bg-green-100 text-green-800' :
                      deal.stage === 'Lost' ? 'bg-red-100 text-red-800' :
                      deal.stage === 'Deal Finalized' || deal.stage === 'Payment Confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {deal.stage}
                    </span>
                  </td>
                )}
                {viewPreferences.tabular.showCreatedDate && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(deal.createdDate)}
                  </td>
                )}
                {viewPreferences.tabular.showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveDeal(deal)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View/Edit Deal"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDeal(deal)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete Deal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedDeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No deals found. Create your first deal to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabularView;
