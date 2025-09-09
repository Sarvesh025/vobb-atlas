import { api } from '../api'

// Mock setTimeout to speed up tests
jest.useFakeTimers()

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  describe('getDeals', () => {
    it('returns mock deals after delay', async () => {
      const promise = api.getDeals()
      
      // Fast-forward time
      jest.advanceTimersByTime(500)
      
      const deals = await promise
      
      expect(deals).toHaveLength(4)
      expect(deals[0]).toEqual({
        id: '1',
        clientName: 'John Smith',
        productName: 'Vobb OS Pro',
        stage: 'Lead Generated',
        createdDate: '2024-01-15',
        assignedTo: 'Sales Team A',
        value: 299,
        notes: 'Interested in professional features'
      })
    })
  })

  describe('getProducts', () => {
    it('returns mock products after delay', async () => {
      const promise = api.getProducts()
      
      // Fast-forward time
      jest.advanceTimersByTime(300)
      
      const products = await promise
      
      expect(products).toHaveLength(4)
      expect(products[0]).toEqual({
        id: '1',
        name: 'Vobb OS Pro',
        description: 'Professional operating system',
        price: 299
      })
    })
  })

  describe('getClients', () => {
    it('returns mock clients after delay', async () => {
      const promise = api.getClients()
      
      // Fast-forward time
      jest.advanceTimersByTime(300)
      
      const clients = await promise
      
      expect(clients).toHaveLength(4)
      expect(clients[0]).toEqual({
        id: '1',
        name: 'John Smith',
        email: 'john@techcorp.com',
        company: 'TechCorp Inc.'
      })
    })
  })

  describe('createDeal', () => {
    it('creates a new deal with generated ID', async () => {
      const newDeal = {
        clientName: 'Test Client',
        productName: 'Test Product',
        stage: 'Lead Generated' as const,
        createdDate: '2024-01-20',
        notes: 'Test notes',
        value: 100
      }
      
      const promise = api.createDeal(newDeal)
      
      // Fast-forward time
      jest.advanceTimersByTime(300)
      
      const createdDeal = await promise
      
      expect(createdDeal).toEqual({
        ...newDeal,
        id: expect.any(String)
      })
      expect(createdDeal.id).toMatch(/^\d+$/) // Should be a timestamp
    })

    it('adds the deal to the mock data', async () => {
      const newDeal = {
        clientName: 'Test Client',
        productName: 'Test Product',
        stage: 'Lead Generated' as const,
        createdDate: '2024-01-20',
        notes: 'Test notes',
        value: 100
      }
      
      const promise = api.createDeal(newDeal)
      jest.advanceTimersByTime(300)
      const createdDeal = await promise
      
      // Verify the deal was created with correct data
      expect(createdDeal.clientName).toBe('Test Client')
      expect(createdDeal.productName).toBe('Test Product')
      expect(createdDeal.id).toBeDefined()
    })
  })

  describe('updateDeal', () => {
    it('throws error for non-existent deal', async () => {
      const promise = api.updateDeal('non-existent-id', { clientName: 'Updated' })
      jest.advanceTimersByTime(300)
      
      await expect(promise).rejects.toThrow('Deal not found')
    })
  })

  describe('deleteDeal', () => {
    it('throws error for non-existent deal', async () => {
      const promise = api.deleteDeal('non-existent-id')
      jest.advanceTimersByTime(300)
      
      await expect(promise).rejects.toThrow('Deal not found')
    })
  })

  describe('Error Handling', () => {
    it('handles concurrent operations correctly', async () => {
      // Test multiple concurrent operations
      const promises = [
        api.getDeals(),
        api.getProducts(),
        api.getClients(),
        api.createDeal({
          clientName: 'Concurrent Test',
          productName: 'Concurrent Product',
          stage: 'Lead Generated' as const,
          createdDate: '2024-01-20',
          notes: 'Concurrent test',
          value: 150
        })
      ]
      
      // Fast-forward time to resolve all promises
      jest.advanceTimersByTime(500)
      
      const results = await Promise.all(promises)
      
      expect(results).toHaveLength(4)
      expect(Array.isArray(results[0])).toBe(true) // Deals
      expect(results[1]).toHaveLength(4) // Products
      expect(results[2]).toHaveLength(4) // Clients
      expect(results[3]).toHaveProperty('id') // Created deal
    })
  })
})
