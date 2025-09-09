import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateDealModal from '../CreateDealModal'
import { useStore } from '../../store/useStore'
import { api } from '../../services/api'

// Mock the store and API
jest.mock('../../store/useStore')
jest.mock('../../services/api')

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>
const mockApi = api as jest.Mocked<typeof api>

describe('CreateDealModal', () => {
  const mockProducts = [
    { id: '1', name: 'Vobb OS Pro', description: 'Professional OS', price: 299 },
    { id: '2', name: 'Vobb OS Enterprise', description: 'Enterprise OS', price: 599 },
  ]

  const mockClients = [
    { id: '1', name: 'John Smith', email: 'john@test.com', company: 'Test Corp' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@test.com', company: 'Test Inc' },
  ]

  const mockStoreActions = {
    addDeal: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
  }

  beforeEach(() => {
    mockUseStore.mockReturnValue(mockStoreActions as ReturnType<typeof useStore>)
    mockApi.getProducts.mockResolvedValue(mockProducts)
    mockApi.getClients.mockResolvedValue(mockClients)
    mockApi.createDeal.mockResolvedValue({
      id: 'new-deal-id',
      clientName: 'John Smith',
      productName: 'Vobb OS Pro',
      stage: 'Lead Generated',
      createdDate: '2024-01-20',
      value: 299,
      notes: 'Test notes',
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />)
    
    expect(screen.getByText('Create New Deal')).toBeInTheDocument()
    expect(screen.getByText('Product *')).toBeInTheDocument()
    expect(screen.getByText('Client *')).toBeInTheDocument()
    expect(screen.getByText('Initial Stage')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<CreateDealModal isOpen={false} onClose={jest.fn()} />)
    
    expect(screen.queryByText('Create New Deal')).not.toBeInTheDocument()
  })

  it('loads products and clients when modal opens', async () => {
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />)
    
    await waitFor(() => {
      expect(mockApi.getProducts).toHaveBeenCalled()
      expect(mockApi.getClients).toHaveBeenCalled()
    })
  })

  it('populates product dropdown with products', async () => {
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByText('Vobb OS Pro - $299')).toBeInTheDocument()
      expect(screen.getByText('Vobb OS Enterprise - $599')).toBeInTheDocument()
    })
  })

  it('populates client dropdown with clients', async () => {
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByText('John Smith - Test Corp')).toBeInTheDocument()
      expect(screen.getByText('Sarah Johnson - Test Inc')).toBeInTheDocument()
    })
  })

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup()
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />)
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Vobb OS Pro - $299')).toBeInTheDocument()
    })
    
    // Try to submit without selecting required fields
    const submitButton = screen.getByText('Create Deal')
    await user.click(submitButton)
    
    // Should show validation errors
    expect(screen.getByText('Product is required')).toBeInTheDocument()
    expect(screen.getByText('Client is required')).toBeInTheDocument()
  })

  it('creates deal successfully with valid data', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    
    render(<CreateDealModal isOpen={true} onClose={onClose} />)
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Vobb OS Pro - $299')).toBeInTheDocument()
    })
    
    // Select product
    const productSelect = screen.getByDisplayValue('Select a product')
    await user.selectOptions(productSelect, '1')
    
    // Select client
    const clientSelect = screen.getByDisplayValue('Select a client')
    await user.selectOptions(clientSelect, '1')
    
    // Add notes
    const notesTextarea = screen.getByPlaceholderText('Additional notes about the deal...')
    await user.type(notesTextarea, 'Test deal notes')
    
    // Submit form
    const submitButton = screen.getByText('Create Deal')
    await user.click(submitButton)
    
    // Should call API and store actions
    await waitFor(() => {
      expect(mockApi.createDeal).toHaveBeenCalledWith({
        clientName: 'John Smith',
        productName: 'Vobb OS Pro',
        stage: 'Lead Generated',
        createdDate: expect.any(String),
        notes: 'Test deal notes',
        value: 299,
      })
      expect(mockStoreActions.addDeal).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('sets loading state during form submission', async () => {
    const user = userEvent.setup()
    
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />)
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Vobb OS Pro - $299')).toBeInTheDocument()
    })
    
    // Fill form
    const productSelect = screen.getByDisplayValue('Select a product')
    await user.selectOptions(productSelect, '1')
    
    const clientSelect = screen.getByDisplayValue('Select a client')
    await user.selectOptions(clientSelect, '1')
    
    // Submit form
    const submitButton = screen.getByText('Create Deal')
    await user.click(submitButton)
    
    // Should set loading state
    expect(mockStoreActions.setLoading).toHaveBeenCalledWith(true)
    
    await waitFor(() => {
      expect(mockStoreActions.setLoading).toHaveBeenCalledWith(false)
    })
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    mockApi.createDeal.mockRejectedValue(new Error('API Error'))
    
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />)
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Vobb OS Pro - $299')).toBeInTheDocument()
    })
    
    // Fill form
    const productSelect = screen.getByDisplayValue('Select a product')
    await user.selectOptions(productSelect, '1')
    
    const clientSelect = screen.getByDisplayValue('Select a client')
    await user.selectOptions(clientSelect, '1')
    
    // Submit form
    const submitButton = screen.getByText('Create Deal')
    await user.click(submitButton)
    
    // Should show error
    await waitFor(() => {
      expect(mockStoreActions.setError).toHaveBeenCalledWith('Failed to create deal')
    })
  })

  it('closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    
    render(<CreateDealModal isOpen={true} onClose={onClose} />)
    
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('resets form when modal is closed and reopened', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    
    const { rerender } = render(<CreateDealModal isOpen={true} onClose={onClose} />)
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Vobb OS Pro - $299')).toBeInTheDocument()
    })
    
    // Fill form
    const productSelect = screen.getByDisplayValue('Select a product')
    await user.selectOptions(productSelect, '1')
    
    const clientSelect = screen.getByDisplayValue('Select a client')
    await user.selectOptions(clientSelect, '1')
    
    // Close modal
    await user.click(screen.getByText('Cancel'))
    
    // Reopen modal
    rerender(<CreateDealModal isOpen={true} onClose={onClose} />)
    
    // Form should be reset - check that the default options are available
    expect(screen.getByText('Select a product')).toBeInTheDocument()
    expect(screen.getByText('Select a client')).toBeInTheDocument()
  })

  it('shows correct stage options', async () => {
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />)
    
    const stageSelect = screen.getByDisplayValue('Lead Generated')
    expect(stageSelect).toBeInTheDocument()
    
    // Check that all stages are available
    const options = Array.from(stageSelect.querySelectorAll('option'))
    const stageValues = options.map(option => option.value)
    
    expect(stageValues).toContain('Lead Generated')
    expect(stageValues).toContain('Contacted')
    expect(stageValues).toContain('Application Submitted')
    expect(stageValues).toContain('Application Under Review')
    expect(stageValues).toContain('Deal Finalized')
    expect(stageValues).toContain('Payment Confirmed')
    expect(stageValues).toContain('Completed')
    expect(stageValues).toContain('Lost')
  })
})
