import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Deal, Product, Client, ViewPreferences, DealStage } from '@/types';

interface Store extends AppState {
  // Actions
  setDeals: (deals: Deal[]) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  moveDeal: (dealId: string, newStage: DealStage) => void;
  setProducts: (products: Product[]) => void;
  setClients: (clients: Client[]) => void;
  setCurrentView: (view: 'tabular' | 'kanban') => void;
  setViewPreferences: (preferences: Partial<ViewPreferences>) => void;
  setActiveDeal: (deal: Deal | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // Auth actions
  login: (user: { name: string; email: string }) => void;
  logout: () => void;
}

interface AppState {
  deals: Deal[];
  products: Product[];
  clients: Client[];
  currentView: 'tabular' | 'kanban';
  viewPreferences: ViewPreferences;
  activeDeal: Deal | null;
  isLoading: boolean;
  error: string | null;
  // Auth state
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
}

const defaultViewPreferences: ViewPreferences = {
  tabular: {
    showClientName: true,
    showProductName: true,
    showStage: true,
    showCreatedDate: true,
    showActions: true,
  },
  kanban: {
    showClientName: true,
    showProductName: true,
    showCreatedDate: true,
  },
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Initial state
      deals: [],
      products: [],
      clients: [],
      currentView: 'tabular',
      viewPreferences: defaultViewPreferences,
      activeDeal: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      user: null,

      // Actions
      setDeals: (deals) => set({ deals }),
      
      addDeal: (deal) => set((state) => ({ 
        deals: [...state.deals, deal] 
      })),
      
      updateDeal: (id, updates) => set((state) => ({
        deals: state.deals.map(deal => 
          deal.id === id ? { ...deal, ...updates } : deal
        )
      })),
      
      deleteDeal: (id) => set((state) => ({
        deals: state.deals.filter(deal => deal.id !== id)
      })),
      
      moveDeal: (dealId, newStage) => set((state) => ({
        deals: state.deals.map(deal => 
          deal.id === dealId ? { ...deal, stage: newStage } : deal
        )
      })),
      
      setProducts: (products) => set({ products }),
      setClients: (clients) => set({ clients }),
      
      setCurrentView: (currentView) => set({ currentView }),
      
      setViewPreferences: (preferences) => set((state) => ({
        viewPreferences: {
          ...state.viewPreferences,
          ...preferences,
          tabular: {
            ...state.viewPreferences.tabular,
            ...preferences.tabular,
          },
          kanban: {
            ...state.viewPreferences.kanban,
            ...preferences.kanban,
          },
        }
      })),
      
      setActiveDeal: (activeDeal) => set({ activeDeal }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Auth
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'vobb-atlas-store',
      partialize: (state) => ({
        currentView: state.currentView,
        viewPreferences: state.viewPreferences,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
