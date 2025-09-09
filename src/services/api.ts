import { Deal, Product, Client } from '@/types';

// Mock data
const mockProducts: Product[] = [
  { id: '1', name: 'Vobb OS Pro', description: 'Professional operating system', price: 299 },
  { id: '2', name: 'Vobb OS Enterprise', description: 'Enterprise-grade OS', price: 599 },
  { id: '3', name: 'Vobb OS Lite', description: 'Lightweight OS for basic needs', price: 99 },
  { id: '4', name: 'Vobb Security Suite', description: 'Advanced security package', price: 199 },
];

const mockClients: Client[] = [
  { id: '1', name: 'John Smith', email: 'john@techcorp.com', company: 'TechCorp Inc.' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@innovate.com', company: 'Innovate Solutions' },
  { id: '3', name: 'Mike Chen', email: 'mike@startup.io', company: 'Startup.io' },
  { id: '4', name: 'Emily Davis', email: 'emily@enterprise.com', company: 'Enterprise Corp' },
];

const mockDeals: Deal[] = [
  {
    id: '1',
    clientName: 'John Smith',
    productName: 'Vobb OS Pro',
    stage: 'Lead Generated',
    createdDate: '2024-01-15',
    assignedTo: 'Sales Team A',
    value: 299,
    notes: 'Interested in professional features'
  },
  {
    id: '2',
    clientName: 'Sarah Johnson',
    productName: 'Vobb OS Enterprise',
    stage: 'Application Submitted',
    createdDate: '2024-01-10',
    assignedTo: 'Sales Team B',
    value: 599,
    notes: 'Large enterprise client'
  },
  {
    id: '3',
    clientName: 'Mike Chen',
    productName: 'Vobb OS Lite',
    stage: 'Contacted',
    createdDate: '2024-01-12',
    assignedTo: 'Sales Team A',
    value: 99,
    notes: 'Startup looking for affordable solution'
  },
  {
    id: '4',
    clientName: 'Emily Davis',
    productName: 'Vobb Security Suite',
    stage: 'Deal Finalized',
    createdDate: '2024-01-08',
    assignedTo: 'Sales Team C',
    value: 199,
    notes: 'Security-focused client'
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Deals
  async getDeals(): Promise<Deal[]> {
    await delay(500);
    return [...mockDeals];
  },

  async createDeal(deal: Omit<Deal, 'id'>): Promise<Deal> {
    await delay(300);
    const newDeal: Deal = {
      ...deal,
      id: Date.now().toString(),
    };
    mockDeals.push(newDeal);
    return newDeal;
  },

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
    await delay(300);
    const index = mockDeals.findIndex(deal => deal.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    mockDeals[index] = { ...mockDeals[index], ...updates };
    return mockDeals[index];
  },

  async deleteDeal(id: string): Promise<void> {
    await delay(300);
    const index = mockDeals.findIndex(deal => deal.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    mockDeals.splice(index, 1);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    await delay(300);
    return [...mockProducts];
  },

  // Clients
  async getClients(): Promise<Client[]> {
    await delay(300);
    return [...mockClients];
  },
};
