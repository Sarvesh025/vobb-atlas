import { render, screen, fireEvent } from '@testing-library/react'
import TabularView from '../TabularView'
import { useStore } from '../../store/useStore'
import { api } from '../../services/api'

// Mock the store and API
jest.mock('../../store/useStore')
jest.mock('../../services/api')

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>
const mockApi = api as jest.Mocked<typeof api>

describe('TabularView', () => {
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
    setLoading: jest.fn(),
    setError: jest.fn(),
  }

  beforeEach(() => {
    mockUseStore.mockReturnValue(mockStoreActions as any)
    mockApi.deleteDeal.mockResolvedValue()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the table header correctly', () => {
    render(<TabularView />)
    
    expect(screen.getByText('Deals Table')).toBeInTheDocument()
    expect(screen.getByText('Client Name')).toBeInTheDocument()
    expect(screen.getByText('Product Name')).toBeInTheDocument()
    expect(screen.getByText('Stage')).toBeInTheDocument()
    expect(screen.getByText('Created Date')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('renders deals in the table', () => {
    render(<TabularView />)
    
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Vobb OS Pro')).toBeInTheDocument()
    expect(screen.getByText('Vobb OS Enterprise')).toBeInTheDocument()
  })

  it('shows correct stage badges with appropriate colors', () => {
    render(<TabularView />)
    
    const leadGeneratedBadge = screen.getAllByText('Lead Generated').find(el => el.tagName === 'SPAN') as HTMLElement
    const completedBadge = screen.getAllByText('Completed').find(el => el.tagName === 'SPAN') as HTMLElement
    
    expect(leadGeneratedBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')
    expect(completedBadge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('formats dates correctly', () => {
    render(<TabularView />)
    
    // The date should be formatted from '2024-01-15' to a localized format
    expect(screen.getByText('1/15/2024')).toBeInTheDocument()
  })

  it('shows column toggle button', () => {
    render(<TabularView />)
    
    expect(screen.getByText('Columns')).toBeInTheDocument()
  })

  it('toggles column visibility when column toggle is clicked', () => {
    render(<TabularView />)
    
    const columnsButton = screen.getByText('Columns')
    fireEvent.click(columnsButton)
    
    // Should show the column toggle dropdown
    expect(screen.getByText('show Client Name')).toBeInTheDocument()
    expect(screen.getByText('show Product Name')).toBeInTheDocument()
  })

  it('calls deleteDeal when delete button is clicked', async () => {
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true)
    
    render(<TabularView />)
    
    const deleteButtons = screen.getAllByTitle('Delete Deal')
    fireEvent.click(deleteButtons[0])
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete the deal for John Smith?')
    expect(mockApi.deleteDeal).toHaveBeenCalledWith('1')
  })

  it('calls setActiveDeal when edit button is clicked', () => {
    render(<TabularView />)
    
    const editButtons = screen.getAllByTitle('View/Edit Deal')
    fireEvent.click(editButtons[0])
    
    expect(mockStoreActions.setActiveDeal).toHaveBeenCalledWith(mockDeals[0])
  })

  it('shows empty state when no deals exist', () => {
    mockUseStore.mockReturnValue({
      ...mockStoreActions,
      deals: [],
    } as any)

    render(<TabularView />)
    
    expect(screen.getByText('No deals found. Create your first deal to get started.')).toBeInTheDocument()
  })

  it('handles column visibility preferences correctly', () => {
    const customPreferences = {
      ...mockViewPreferences,
      tabular: {
        ...mockViewPreferences.tabular,
        showClientName: false,
        showProductName: false,
      }
    }

    mockUseStore.mockReturnValue({
      ...mockStoreActions,
      viewPreferences: customPreferences,
    } as any)

    render(<TabularView />)
    
    // Client Name and Product Name columns should not be visible
    expect(screen.queryByText('Client Name')).not.toBeInTheDocument()
    expect(screen.queryByText('Product Name')).not.toBeInTheDocument()
    
    // Other columns should still be visible
    expect(screen.getByText('Stage')).toBeInTheDocument()
    expect(screen.getByText('Created Date')).toBeInTheDocument()
  })
})
