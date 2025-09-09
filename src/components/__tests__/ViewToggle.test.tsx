import { render, screen, fireEvent } from '@testing-library/react'
import ViewToggle from '../ViewToggle'
import { useStore } from '../../store/useStore'

// Mock the store
jest.mock('../../store/useStore')

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>

describe('ViewToggle', () => {
  const mockSetCurrentView = jest.fn()

  beforeEach(() => {
    mockUseStore.mockReturnValue({
      currentView: 'tabular',
      setCurrentView: mockSetCurrentView,
    } as ReturnType<typeof useStore>)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders both view options', () => {
    render(<ViewToggle />)
    
    expect(screen.getByText('Tabular')).toBeInTheDocument()
    expect(screen.getByText('Kanban')).toBeInTheDocument()
  })

  it('shows tabular as active by default', () => {
    render(<ViewToggle />)
    
    const tabularButton = screen.getByText('Tabular').closest('button')
    const kanbanButton = screen.getByText('Kanban').closest('button')
    
    expect(tabularButton).toHaveClass('bg-white', 'text-blue-600')
    expect(kanbanButton).toHaveClass('text-gray-600')
  })

  it('shows kanban as active when currentView is kanban', () => {
    mockUseStore.mockReturnValue({
      currentView: 'kanban',
      setCurrentView: mockSetCurrentView,
    } as ReturnType<typeof useStore>)

    render(<ViewToggle />)
    
    const tabularButton = screen.getByText('Tabular').closest('button')
    const kanbanButton = screen.getByText('Kanban').closest('button')
    
    expect(kanbanButton).toHaveClass('bg-white', 'text-blue-600')
    expect(tabularButton).toHaveClass('text-gray-600')
  })

  it('calls setCurrentView with tabular when tabular button is clicked', () => {
    render(<ViewToggle />)
    
    fireEvent.click(screen.getByText('Tabular'))
    
    expect(mockSetCurrentView).toHaveBeenCalledWith('tabular')
  })

  it('calls setCurrentView with kanban when kanban button is clicked', () => {
    render(<ViewToggle />)
    
    fireEvent.click(screen.getByText('Kanban'))
    
    expect(mockSetCurrentView).toHaveBeenCalledWith('kanban')
  })

  it('renders without crashing', () => {
    render(<ViewToggle />)
    
    // Just verify the component renders without errors
    expect(screen.getByText('Tabular')).toBeInTheDocument()
    expect(screen.getByText('Kanban')).toBeInTheDocument()
  })
})
