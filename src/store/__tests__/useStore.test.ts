import { renderHook, act } from '@testing-library/react'
import { useStore } from '../useStore'

// Mock Zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}))

describe('useStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    const { result } = renderHook(() => useStore())
    act(() => {
      result.current.setDeals([])
      result.current.setProducts([])
      result.current.setClients([])
      result.current.setCurrentView('tabular')
      result.current.setViewPreferences({
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
      })
      result.current.setActiveDeal(null)
      result.current.setLoading(false)
      result.current.setError(null)
    })
  })

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const { result } = renderHook(() => useStore())
      
      expect(result.current.deals).toEqual([])
      expect(result.current.products).toEqual([])
      expect(result.current.clients).toEqual([])
      expect(result.current.currentView).toBe('tabular')
      expect(result.current.viewPreferences.tabular.showClientName).toBe(true)
      expect(result.current.activeDeal).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('Deals Management', () => {
    it('sets deals correctly', () => {
      const { result } = renderHook(() => useStore())
      const mockDeals = [
        { id: '1', clientName: 'John', productName: 'Product', stage: 'Lead Generated' as const, createdDate: '2024-01-01' },
      ]
      
      act(() => {
        result.current.setDeals(mockDeals)
      })
      
      expect(result.current.deals).toEqual(mockDeals)
    })

    it('adds a new deal', () => {
      const { result } = renderHook(() => useStore())
      const newDeal = {
        id: '1',
        clientName: 'John',
        productName: 'Product',
        stage: 'Lead Generated' as const,
        createdDate: '2024-01-01',
      }
      
      act(() => {
        result.current.addDeal(newDeal)
      })
      
      expect(result.current.deals).toHaveLength(1)
      expect(result.current.deals[0]).toEqual(newDeal)
    })

    it('updates an existing deal', () => {
      const { result } = renderHook(() => useStore())
      const deal = {
        id: '1',
        clientName: 'John',
        productName: 'Product',
        stage: 'Lead Generated' as const,
        createdDate: '2024-01-01',
      }
      
      act(() => {
        result.current.addDeal(deal)
        result.current.updateDeal('1', { clientName: 'Jane' })
      })
      
      expect(result.current.deals[0].clientName).toBe('Jane')
      expect(result.current.deals[0].productName).toBe('Product') // Other fields unchanged
    })

    it('deletes a deal', () => {
      const { result } = renderHook(() => useStore())
      const deal = {
        id: '1',
        clientName: 'John',
        productName: 'Product',
        stage: 'Lead Generated' as const,
        createdDate: '2024-01-01',
      }
      
      act(() => {
        result.current.addDeal(deal)
        result.current.deleteDeal('1')
      })
      
      expect(result.current.deals).toHaveLength(0)
    })

    it('moves a deal to a new stage', () => {
      const { result } = renderHook(() => useStore())
      const deal = {
        id: '1',
        clientName: 'John',
        productName: 'Product',
        stage: 'Lead Generated' as const,
        createdDate: '2024-01-01',
      }
      
      act(() => {
        result.current.addDeal(deal)
        result.current.moveDeal('1', 'Contacted')
      })
      
      expect(result.current.deals[0].stage).toBe('Contacted')
    })
  })

  describe('Products and Clients', () => {
    it('sets products correctly', () => {
      const { result } = renderHook(() => useStore())
      const mockProducts = [
        { id: '1', name: 'Product 1', description: 'Desc 1', price: 100 },
      ]
      
      act(() => {
        result.current.setProducts(mockProducts)
      })
      
      expect(result.current.products).toEqual(mockProducts)
    })

    it('sets clients correctly', () => {
      const { result } = renderHook(() => useStore())
      const mockClients = [
        { id: '1', name: 'Client 1', email: 'client@test.com', company: 'Company 1' },
      ]
      
      act(() => {
        result.current.setClients(mockClients)
      })
      
      expect(result.current.clients).toEqual(mockClients)
    })
  })

  describe('View Management', () => {
    it('sets current view correctly', () => {
      const { result } = renderHook(() => useStore())
      
      act(() => {
        result.current.setCurrentView('kanban')
      })
      
      expect(result.current.currentView).toBe('kanban')
    })

    it('sets view preferences correctly', () => {
      const { result } = renderHook(() => useStore())
      const newPreferences = {
        tabular: {
          showClientName: false,
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
      }
      
      act(() => {
        result.current.setViewPreferences(newPreferences)
      })
      
      expect(result.current.viewPreferences.tabular.showClientName).toBe(false)
      expect(result.current.viewPreferences.tabular.showProductName).toBe(true)
    })

    it('updates partial view preferences', () => {
      const { result } = renderHook(() => useStore())
      
      act(() => {
        result.current.setViewPreferences({
          tabular: { showClientName: false },
        })
      })
      
      expect(result.current.viewPreferences.tabular.showClientName).toBe(false)
      expect(result.current.viewPreferences.tabular.showProductName).toBe(true) // Unchanged
      expect(result.current.viewPreferences.kanban.showClientName).toBe(true) // Unchanged
    })
  })

  describe('UI State', () => {
    it('sets active deal correctly', () => {
      const { result } = renderHook(() => useStore())
      const deal = {
        id: '1',
        clientName: 'John',
        productName: 'Product',
        stage: 'Lead Generated' as const,
        createdDate: '2024-01-01',
      }
      
      act(() => {
        result.current.setActiveDeal(deal)
      })
      
      expect(result.current.activeDeal).toEqual(deal)
    })

    it('sets loading state correctly', () => {
      const { result } = renderHook(() => useStore())
      
      act(() => {
        result.current.setLoading(true)
      })
      
      expect(result.current.isLoading).toBe(true)
    })

    it('sets error state correctly', () => {
      const { result } = renderHook(() => useStore())
      
      act(() => {
        result.current.setError('Test error message')
      })
      
      expect(result.current.error).toBe('Test error message')
    })
  })

  describe('State Immutability', () => {
    it('does not mutate original state when updating', () => {
      const { result } = renderHook(() => useStore())
      const originalDeals = [
        { id: '1', clientName: 'John', productName: 'Product', stage: 'Lead Generated' as const, createdDate: '2024-01-01' },
      ]
      
      act(() => {
        result.current.setDeals(originalDeals)
      })
      
      const originalDealsCopy = [...originalDeals]
      
      act(() => {
        result.current.updateDeal('1', { clientName: 'Jane' })
      })
      
      expect(originalDeals).toEqual(originalDealsCopy)
      expect(result.current.deals[0].clientName).toBe('Jane')
    })
  })
})
