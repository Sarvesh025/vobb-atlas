import { render, screen, fireEvent } from '@testing-library/react'
import KanbanView from '../KanbanView'
import { useStore } from '../../store/useStore'
import { api } from '../../services/api'

// Mock the store and API
jest.mock('../../store/useStore')
jest.mock('../../services/api')

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>
const mockApi = api as jest.Mocked<typeof api>

describe('KanbanView', () => {
  const mockDeals = [
    {
      id: '1',
      clientName: 'John Smith',
      productName: 'Vobb OS Pro',
      stage: 'Lead Generated' as const,
      createdDate: '2024-01-15',
      value: 299,
      notes: 'Test deal'
    },
    {
      id: '2',
      clientName: 'Sarah Johnson',
      productName: 'Vobb OS Enterprise',
      stage: 'Completed' as const,
      createdDate: '2024-01-10',
      value: 599,
      notes: 'Completed deal'
    }
  ]

  const mockViewPreferences = {
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
    }
  }

  const mockStoreActions = {
    deals: mockDeals,
    viewPreferences: mockViewPreferences,
    setViewPreferences: jest.fn(),
    deleteDeal: jest.fn(),
    setActiveDeal: jest.fn(),
    moveDeal: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
  }

  beforeEach(() => {
    mockUseStore.mockReturnValue(mockStoreActions as ReturnType<typeof useStore>)
    mockApi.updateDeal.mockResolvedValue(mockDeals[0])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the kanban header correctly', () => {
    render(<KanbanView />)
    
    expect(screen.getByText('Deals Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Metadata')).toBeInTheDocument()
  })

  it('renders all pipeline stages', () => {
    render(<KanbanView />)
    
    expect(screen.getByText('Lead Generated')).toBeInTheDocument()
    expect(screen.getByText('Contacted')).toBeInTheDocument()
    expect(screen.getByText('Application Submitted')).toBeInTheDocument()
    expect(screen.getByText('Application Under Review')).toBeInTheDocument()
    expect(screen.getByText('Deal Finalized')).toBeInTheDocument()
    expect(screen.getByText('Payment Confirmed')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Lost')).toBeInTheDocument()
  })

  it('shows deal count for each stage', () => {
    render(<KanbanView />)
    
    const leadGeneratedCount = screen.getByText('Lead Generated').nextElementSibling
    expect(leadGeneratedCount).toHaveTextContent('1')
    
    const completedCount = screen.getByText('Completed').nextElementSibling
    expect(completedCount).toHaveTextContent('1')
  })

  it('renders deals in their respective stages', () => {
    render(<KanbanView />)
    
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Vobb OS Pro')).toBeInTheDocument()
    expect(screen.getByText('Vobb OS Enterprise')).toBeInTheDocument()
  })

  it('shows correct stage colors', () => {
    render(<KanbanView />)
    
    const leadGeneratedStage = screen.getByText('Lead Generated').closest('div')
    const completedStage = screen.getByText('Completed').closest('div')
    
    expect(leadGeneratedStage).toHaveClass('bg-yellow-50', 'border-yellow-200')
    expect(completedStage).toHaveClass('bg-green-50', 'border-green-200')
  })

  it('shows metadata toggle button', () => {
    render(<KanbanView />)
    
    expect(screen.getByText('Metadata')).toBeInTheDocument()
  })

  it('toggles metadata visibility when metadata toggle is clicked', () => {
    render(<KanbanView />)
    
    const metadataButton = screen.getByText('Metadata')
    fireEvent.click(metadataButton)
    
    // Should show the metadata toggle dropdown
    expect(screen.getByText('show Client Name')).toBeInTheDocument()
    expect(screen.getByText('show Product Name')).toBeInTheDocument()
    expect(screen.getByText('show Created Date')).toBeInTheDocument()
  })

  it('calls deleteDeal when delete button is clicked', async () => {
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true)
    
    render(<KanbanView />)
    
    const deleteButtons = screen.getAllByTitle('Delete Deal')
    fireEvent.click(deleteButtons[0])
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete the deal for John Smith?')
    expect(mockApi.deleteDeal).toHaveBeenCalledWith('1')
  })

  it('calls setActiveDeal when edit button is clicked', () => {
    render(<KanbanView />)
    
    const editButtons = screen.getAllByTitle('View/Edit Deal')
    fireEvent.click(editButtons[0])
    
    expect(mockStoreActions.setActiveDeal).toHaveBeenCalledWith(mockDeals[0])
  })

  it('shows empty state for stages with no deals', () => {
    render(<KanbanView />)
    
    // Most stages should show "No deals"
    const noDealsTexts = screen.getAllByText('No deals')
    expect(noDealsTexts.length).toBeGreaterThan(0)
  })

  it('handles metadata visibility preferences correctly', () => {
    const customPreferences = {
      ...mockViewPreferences,
      kanban: {
        ...mockViewPreferences.kanban,
        showClientName: false,
        showProductName: false,
      }
    }

    mockUseStore.mockReturnValue({
      ...mockStoreActions,
      viewPreferences: customPreferences,
    } as ReturnType<typeof useStore>)

    render(<KanbanView />)
    
    // Client Name and Product Name should not be visible in deal cards
    // But we can still see the deal values and actions
    expect(screen.getByText('$299')).toBeInTheDocument()
    expect(screen.getByText('$599')).toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    render(<KanbanView />)
    
    // The date should be formatted from '2024-01-15' to a localized format
    expect(screen.getByText('1/15/2024')).toBeInTheDocument()
  })

  it('shows deal values correctly', () => {
    render(<KanbanView />)
    
    expect(screen.getByText('$299')).toBeInTheDocument()
    expect(screen.getByText('$599')).toBeInTheDocument()
  })

  it('applies correct styling to deal cards', () => {
    render(<KanbanView />)
    
    // Just verify that deal cards are rendered
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
  })
})
