'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Deal, Product, Client, DealStage } from '@/types';
import { api } from '@/services/api';

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDealModal = ({ isOpen, onClose }: CreateDealModalProps) => {
  const { addDeal, setLoading, setError } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    productId: '',
    clientId: '',
    stage: 'Lead Generated' as DealStage,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, clientsData] = await Promise.all([
        api.getProducts(),
        api.getClients(),
      ]);
      setProducts(productsData);
      setClients(clientsData);
    } catch {
      setError('Failed to load products and clients');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productId) {
      newErrors.productId = 'Product is required';
    }
    if (!formData.clientId) {
      newErrors.clientId = 'Client is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const selectedProduct = products.find(p => p.id === formData.productId);
      const selectedClient = clients.find(c => c.id === formData.clientId);

      if (!selectedProduct || !selectedClient) {
        throw new Error('Invalid product or client selection');
      }

      // Create new deal
      const newDeal: Omit<Deal, 'id'> = {
        clientName: selectedClient.name,
        productName: selectedProduct.name,
        stage: formData.stage,
        createdDate: new Date().toISOString().split('T')[0],
        notes: formData.notes,
        value: selectedProduct.price,
      };
      const createdDeal = await api.createDeal(newDeal);
      addDeal(createdDeal);
      
      setFormData({
        productId: '',
        clientId: '',
        stage: 'Lead Generated',
        notes: '',
      });
      setErrors({});
      onClose();
    } catch {
      setError('Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create New Deal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product *
            </label>
            <select
              value={formData.productId}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.productId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.clientId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.company}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Stage
            </label>
            <select
              value={formData.stage}
              onChange={(e) => handleInputChange('stage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Lead Generated">Lead Generated</option>
              <option value="Contacted">Contacted</option>
              <option value="Application Submitted">Application Submitted</option>
              <option value="Application Under Review">Application Under Review</option>
              <option value="Deal Finalized">Deal Finalized</option>
              <option value="Payment Confirmed">Payment Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about the deal..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Deal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDealModal;
