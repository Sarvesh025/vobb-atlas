'use client';

import { useState } from 'react';
import { Eye, EyeOff, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Deal, DealStage } from '@/types';
import { api } from '@/services/api';

const KanbanView = () => {
  const { deals, viewPreferences, setViewPreferences, deleteDeal, setActiveDeal, moveDeal, setLoading, setError } = useStore();
  const [showMetadataToggle, setShowMetadataToggle] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const pipelineStages: DealStage[] = [
    'Lead Generated',
    'Contacted',
    'Application Submitted',
    'Application Under Review',
    'Deal Finalized',
    'Payment Confirmed',
    'Completed',
    'Lost'
  ];

  const handleDeleteDeal = async (deal: Deal) => {
    if (window.confirm(`Are you sure you want to delete the deal for ${deal.clientName}?`)) {
      try {
        setLoading(true);
        await api.deleteDeal(deal.id);
        deleteDeal(deal.id);
      } catch (error) {
        setError('Failed to delete deal');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      try {
        setLoading(true);
        await api.updateDeal(draggedDeal.id, { stage: targetStage });
        moveDeal(draggedDeal.id, targetStage);
      } catch (error) {
        setError('Failed to update deal stage');
      } finally {
        setLoading(false);
      }
    }
    
    setDraggedDeal(null);
  };

  const toggleMetadata = (field: keyof typeof viewPreferences.kanban) => {
    setViewPreferences({
      kanban: {
        ...viewPreferences.kanban,
        [field]: !viewPreferences.kanban[field],
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStageColor = (stage: DealStage) => {
    switch (stage) {
      case 'Completed':
        return 'bg-green-50 border-green-200';
      case 'Lost':
        return 'bg-red-50 border-red-200';
      case 'Deal Finalized':
      case 'Payment Confirmed':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getStageTextColor = (stage: DealStage) => {
    switch (stage) {
      case 'Completed':
        return 'text-green-800';
      case 'Lost':
        return 'text-red-800';
      case 'Deal Finalized':
      case 'Payment Confirmed':
        return 'text-blue-800';
      default:
        return 'text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with metadata toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Deals Pipeline</h3>
        <div className="relative">
          <button
            onClick={() => setShowMetadataToggle(!showMetadataToggle)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {showMetadataToggle ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>Metadata</span>
          </button>
          
          {showMetadataToggle && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="py-2">
                {Object.entries(viewPreferences.kanban).map(([key, visible]) => (
                  <button
                    key={key}
                    onClick={() => toggleMetadata(key as keyof typeof viewPreferences.kanban)}
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

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
        {pipelineStages.map((stage) => {
          const stageDeals = deals.filter(deal => deal.stage === stage);
          
          return (
            <div
              key={stage}
              className="min-h-[200px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className={`p-3 rounded-lg border-2 ${getStageColor(stage)}`}>
                <h4 className={`font-medium text-sm mb-3 ${getStageTextColor(stage)}`}>
                  {stage}
                  <span className="ml-2 bg-white bg-opacity-50 px-2 py-1 rounded-full text-xs">
                    {stageDeals.length}
                  </span>
                </h4>
                
                <div className="space-y-2">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                    >
                      {viewPreferences.kanban.showClientName && (
                        <div className="font-medium text-sm text-gray-900 mb-1">
                          {deal.clientName}
                        </div>
                      )}
                      
                      {viewPreferences.kanban.showProductName && (
                        <div className="text-sm text-gray-600 mb-1">
                          {deal.productName}
                        </div>
                      )}
                      
                      {viewPreferences.kanban.showCreatedDate && (
                        <div className="text-xs text-gray-500 mb-2">
                          {formatDate(deal.createdDate)}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-gray-700">
                          ${deal.value || 0}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setActiveDeal(deal)}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                            title="View/Edit Deal"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteDeal(deal)}
                            className="text-red-600 hover:text-red-900 transition-colors p-1"
                            title="Delete Deal"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageDeals.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No deals
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanView;
