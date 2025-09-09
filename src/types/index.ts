export interface Deal {
  id: string;
  clientName: string;
  productName: string;
  stage: DealStage;
  createdDate: string;
  assignedTo?: string;
  value?: number;
  notes?: string;
}

export type DealStage = 
  | 'Lead Generated'
  | 'Contacted'
  | 'Application Submitted'
  | 'Application Under Review'
  | 'Deal Finalized'
  | 'Payment Confirmed'
  | 'Completed'
  | 'Lost';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

export interface ViewPreferences {
  tabular: {
    showClientName: boolean;
    showProductName: boolean;
    showStage: boolean;
    showCreatedDate: boolean;
    showActions: boolean;
  };
  kanban: {
    showClientName: boolean;
    showProductName: boolean;
    showCreatedDate: boolean;
  };
}

export interface AppState {
  deals: Deal[];
  products: Product[];
  clients: Client[];
  currentView: 'tabular' | 'kanban';
  viewPreferences: ViewPreferences;
  activeDeal: Deal | null;
  isLoading: boolean;
  error: string | null;
}
